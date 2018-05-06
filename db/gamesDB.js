const db = require('../db');

class GamesDB {

    constructor () {
        
    }

    // *****************************
    //
    //      Private Functions
    //
    // *****************************

    __dbCreateNewGameRecord(userId, gameIdCallback, dbx = db) {
        const sqlGetUserRecord = `SELECT id FROM users WHERE id=($1);`;

        const sqlCreateGame =  `INSERT INTO games 
                                (active, turn) 
                                VALUES 
                                ('active', 'white') 
                                RETURNING id;`;

        if (isNaN(userId)) return false;

        dbx.one(sqlGetUserRecord, [userId])
            .then(userRecord => {
                if (userRecord.id != userId) {
                    if ((typeof gameIdCallback === 'function')) {
                        gameIdCallback(-1);
                    }
                } else {
                    dbx.one(sqlCreateGame)
                        .then(newGameRecord => {
                            if ((typeof gameIdCallback === 'function')) {
                                gameIdCallback(newGameRecord.id);
                            }
                        })
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    __dbCreateNewGameUsersRecord(gameId, userId, gameIdCallback, dbx = db) {
        const sqlCreateGameUser = ` INSERT INTO game_users
                                    (gameid, userid)
                                    VALUES
                                    ($1, $2);`;

        dbx.none(sqlCreateGameUser, [gameId, userId])
            .then(() => {
                if ((typeof gameIdCallback) === 'function') {
                    gameIdCallback(gameId);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    __dbCreateAllNewGamePiecesRecords(gameId, gameIdCallback, dbx = db) {
        dbx.tx(t1 => {
            const sqlGetPieceId = `SELECT id FROM pieces WHERE name=($1) AND faction=($2);`;

            const sqlCreateGamePiece = `INSERT INTO game_pieces
                                        (gameid, pieceid, coordinate_x, coordinate_y, alive)
                                        VALUES
                                        ($1, $2, $3, $4, $5);`;

            const transactions = [];

            const specialPieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
            const armyDetails   = [ {faction: "white", pawnRowNum: '2', specialRowNum: '1'},
                                    {faction: "black", pawnRowNum: '7', specialRowNum: '8'}  ];

            for (let adx = 0; adx < armyDetails.length; adx++) {
                for (let sdx = 0; sdx < specialPieces.length; sdx++) {
                    const alphaRow      = String.fromCharCode(97 + sdx);
                    const faction       = armyDetails[adx].faction;
                    const pawnRowNum    = armyDetails[adx].pawnRowNum;
                    const specialRowNum = armyDetails[adx].specialRowNum;
    
                    transactions.push(
                        t1.one(sqlGetPieceId, ['pawn', faction])
                            .then(pieceRecord => {
                                const pieceId = pieceRecord['id'];
                                return t1.any(sqlCreateGamePiece, [gameId, pieceId, alphaRow, pawnRowNum, true])
                            })
                        ,
                        t1.one(sqlGetPieceId, [specialPieces[sdx], faction])
                            .then(pieceRecord => {
                                const pieceId = pieceRecord['id'];return t1.any(sqlCreateGamePiece, [gameId, pieceId, alphaRow, specialRowNum, true])
                            })
                        );
                }
            }
            
            return t1.batch(transactions);
        })
        .then(() => {
            if ((typeof gameIdCallback) === 'function') {
                gameIdCallback(gameId);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    __dbSetUserGamePiecesRecords(gameId, userId, faction, gameIdCallback, dbx = db) {
        const sqlGetPieceRecordsByFaction = `SELECT id FROM pieces WHERE faction=($1)`; 

        const sqlSetSqlGamePieces = `UPDATE game_pieces
                                     SET userid=($1)
                                     WHERE pieceid=($2) AND gameid=($3)`              

        dbx.tx(t1 => {
            const transactions = [];

            transactions.push(
                t1.any(sqlGetPieceRecordsByFaction, [faction])
                    .then(pieceRecords => {
                        for (let idx = 0; idx < pieceRecords.length; idx++) {
                            const pieceRecord = pieceRecords[idx];
                            const pieceId = pieceRecord.id;
                            t1.none(sqlSetSqlGamePieces, [userId, pieceId, gameId])
                        }
                    })
            )

            return t1.batch(transactions);
        })
        .then(() => {
            if ((typeof gameIdCallback === 'function')) {
                gameIdCallback(gameId);
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    // *****************************
    //
    //      Public Functions
    //
    // *****************************

    /**
     * Creates the appropriate records within the database for a new game.
     * @param {Number} userId The host's ID to attach to the newly created game record.
     * @param {String} faction The faction of this user.
     * @param {Function} gameIdCallback Callback function to return the ID of the newly created game record.
     */
    createNewGame(userId, faction, gameIdCallback) {
        this.__dbCreateNewGameRecord(userId, (gameId => {
            this.__dbCreateNewGameUsersRecord(gameId, userId, (gameId => {
                this.__dbCreateAllNewGamePiecesRecords(gameId, (gameId) => {
                    this.__dbSetUserGamePiecesRecords(gameId, userId, faction, gameIdCallback);
                })
            }))
        }))    
    }
   
    /**
     * Retrieve the desired records from the game_pieces table by the given game ID.
     * @param {Number} gameId The game ID to identify the all the records in the game_pieces table.
     * @param {Function} callbackFunction The callback function to return the game_piece records to.
     */
    getAllGamePiecesFrom(gameId, callbackFunction) {
        const sqlGetFromGamePieces = `SELECT * FROM game_pieces WHERE gameid=($1)`;

        db.any(sqlGetFromGamePieces, [gameId])
            .then(gamePieceRecords => {
                callbackFunction(gamePieceRecords);
            })
            .catch(error => {
                console.log(error);
            });
    }

    /**
     * Retrieve all pieces table records from the database and return the records to the given callback function.
     * @param {Function} callbackFunction The function to return all the pieces records to.
     */
    getAllPieces(callbackFunction) {
        const sqlGetFromPieces = `SELECT * FROM pieces`;

        db.any(sqlGetFromPieces)
            .then(pieceRecords => {
                callbackFunction(pieceRecords);
            })
            .catch(error => {
                console.log(error);
            });
    }

}

module.exports = GamesDB;