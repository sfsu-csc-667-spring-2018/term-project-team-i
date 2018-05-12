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
                                ('idle', 'white') 
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
            if ((typeof gameIdCallback) === 'function') {
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
     * Retrieves the record of users of a given game ID from the game_users table.
     * @param {Number} gameId The game ID to target the game user record.
     * @param {Function} callbackFunction The callback function to pass the returned game_users record to.
     * @param {Object} dbx Optional database object to use in case of transactions.
     */
    getGameUsers(gameId, callbackFunction, dbx = db) {
        const sqlGetGameUsers = `SELECT * FROM game_users WHERE gameid=($1);`;

        dbx.one(sqlGetGameUsers, [gameId])
            .then(gameUserRecord => {
                callbackFunction(gameUserRecord);
            })
            .catch(error => {
                console.log(error);
            })
    }

    /**
     * Retrieve all the records from the pieces table.
     * @param {Function} callbackFunction The function to return the retrieved pieces array data to.
     * @param {*} dbx Optional database object for the use of transactions.
     */
    getPieces(callbackFunction, dbx = db) {
        const sqlGetAllPieces = `SELECT * FROM pieces;`;

        dbx.any(sqlGetAllPieces)
            .then(pieceRecords => {
                callbackFunction(pieceRecords);
            })
            .catch(error => {
                console.log(error);
            })
    }

    /**
     * Retrieve all game_pieces and pieces records by joining them together as a single array. The
     * conditions are that the game_pieces must be alive and belong to a given game ID.
     * @param {Number} gameId The game ID to identify the all the records in the game_pieces table.
     * @param {Function} callbackFunction The callback function to return the game_piece records to.
     * @param {Object} dbx The database object to query the tables from. This is optional in case of transaction usage.
     */
    getGamePiecesAlive(gameId, callbackFunction, dbx = db) {
        const sqlGetJoinPieces =   `SELECT * FROM game_pieces 
                                    FULL OUTER JOIN pieces 
                                    ON game_pieces.pieceid=pieces.id
                                    WHERE game_pieces.gameid=($1) AND game_pieces.alive=($2);`

        dbx.any(sqlGetJoinPieces, [gameId, true])
            .then(joinedPieceRecords => {
                callbackFunction(joinedPieceRecords);
            })
            .catch(error => {
                console.log(error);
            });
    }

    /**
     * Retrieves a single game piece record from the game_pieces table.
     * @param {Number} gameId 
     * @param {Number} userId 
     * @param {Number} pieceId 
     * @param {String} coordinate_x 
     * @param {Number} coordiante_y 
     * @param {Function} callbackFunction The callback function to return the return the one record to.
     * @param {Object} dbx Optional database object for the use of transactions.
     */
    getGamePiece(gameId, userId, pieceId, coordinate_x, coordiante_y, callbackFunction, dbx = db) {
        const sqlGetPiece = `SELECT * FROM game_pieces
                             WHERE gameid=($1) AND userid=($2) AND pieceid=($3) AND coordinate_x=($4) AND coordinate_y=($5);`;

        dbx.one(sqlGetPiece, [gameId, userId, pieceId, coordiante_x, coordiante_y])
            .then(gamePieceRecord => {
                callbackFunction(gamePieceRecord);
            })
            .catch(error => {
                console.log(error);
            })
    }

    /**
     * Moves a piece from the given x-y coordinates to the destination x-y coordinates. Note that if an existing piece
     * exists at the destination then it will be automatically be set to dead (via null x-y coordinates and alive=false).
     * @param {*} gameId The game ID of which to find the piece in.
     * @param {*} pieceId The piece ID of the piece to move.
     * @param {*} coordinate_x The x coordinate of the piece to move.
     * @param {*} coordinate_y Tge y cooridinate of the piece to move.
     * @param {*} destination_x The x destination coordinate of the piece to move to.
     * @param {*} destination_y The y destination coordinate of the piece to move to.
     * @param {*} callbackFunction The callback function to executate after this current function execution (no data is returned).
     * @param {*} dbx Optional database object to use in case of transactions.
     */
    setGamePieceCoordinates(gameId, pieceId, coordinate_x, coordinate_y, destination_x, destination_y, callbackFunction, dbx = db) {
        const sqlSetPieceCoordinates = `UPDATE game_pieces
                                        SET coordinate_x=($1), coordinate_y=($2)
                                        WHERE gameid=($3) AND pieceid=($4) AND coordinate_x=($5) AND coordinate_y=($6);`;

        const sqlGetPieceAtCoordinates =    `SELECT * FROM game_pieces 
                                             WHERE gameid=($1) AND coordinate_x=($2) AND coordinate_y=($3);`;

        
        dbx.tx(t1 => {
            const transactions = [];
            
            transactions.push(
                t1.any(sqlGetPieceAtCoordinates, [gameId, destination_x, destination_y])
                    .then(gamePiecesAtDestination => {
                        if (gamePiecesAtDestination.length > 0 && gamePiecesAtDestination[0]['pieceid'] !== pieceId) {
                            this.setGamePieceToDead(gameId, destination_x, destination_y, () => {}, t1);
                        }
                    })
                    .then(() => {
                        t1.none(sqlSetPieceCoordinates, [destination_x, destination_y, gameId, pieceId, coordinate_x, coordinate_y])
                            .catch(error => {
                                console.log(error);
                            })
                    })
                    .catch(error => {
                        console.log(error);
                    })
            )

            return t1.batch(transactions);
        })
        .then(() => {
            callbackFunction();
        })
        .catch(error => {
            console.log(error);
        })
    }

    setGamePieceToDead(gameId, coordinate_x, coordinate_y, callbackFunction, dbx = db) {
        const sqlSetGamePieceDead = `UPDATE game_pieces
                                     SET coordinate_x=NULL, coordinate_y=NULL, alive=false
                                     WHERE gameid=($1) AND coordinate_x=($2) AND coordinate_y=($3);`;
                 
        
        dbx.none(sqlSetGamePieceDead, [gameId, coordinate_x, coordinate_y])
            .then(() => {
                callbackFunction();
            })
            .catch(error => {
                console.log(error);
            })
    }

    /**
     * Set the active state for a specific game.
     * @param {*} gameId The ID referring to a specific game.
     * @param {*} activeState The active state to set a game to. The options are {'active' , 'idle', 'not_active'}
     * @param {*} callbackFunction The callback function to call after execution; there is no data returned.
     * @param {*} dbx Optional database object for the use of transactions. 
     */
    setGameActiveState(gameId, activeState, callbackFunction, dbx = db) {
        const sqlSetGameState = `UPDATE games
                                 SET active=($1)
                                 WHERE id=($2);`;

        dbx.any(sqlSetGameState, [activeState, gameId])
            .then(() => {
                callbackFunction();
            })
            .catch(error => {
                console.log(error);
            })
    }

    /**
     * Set the opponent of the specific game in the database.
     * @param {Number} gameId The ID of the game of which to modify the opponent ID value of.
     * @param {Number} opponentId The ID of the opponent for a the given game.
     * @param {Function} callbackFunction The callback function to call after execution; no data is given.
     * @param {*} dbx Optional database object for the use of transactions.
     */
    setGameUsersOpponent(gameId, opponentId, callbackFunction, dbx = db) {
        const sqlSetOpponent = `UPDATE game_users
                                SET opponentid=($1)
                                WHERE gameid=(2);`;

        dbx.any(sqlSetOpponent, [opponentId, gameId])
            .then(() => {
                callbackFunction();
            })
            .catch(error => {
                console.log(error);
            })
    }


}

module.exports = GamesDB;