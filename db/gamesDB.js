const db = require('../db');

class GamesDB {

    constructor () {
        
    }

    /**
     * Creates the appropriate records within the database for a new game.
     * @param {Number} userId - The host's ID to attach to the newly created game record.
     * @param {Function} gameIdCallback - Callback function to return the ID of the newly created game record.
     */
    createGame(userId, gameIdCallback) {
        const sqlSelectGame =   `SELECT id FROM games WHERE id=($1)`;

        const sqlCreateGame =  `INSERT INTO games 
                                (active, turn) 
                                VALUES 
                                ('active', 'white') 
                                RETURNING id;`;

        const sqlCreateGameUser = ` INSERT INTO game_users
                                    (gameid, userid)
                                    VALUES
                                    ($1, $2);`;

        const sqlGetPieceId = `SELECT id FROM pieces WHERE name=($1) AND faction=($2)`;

        const sqlCreateGamePiece = `INSERT INTO game_pieces
                                    (gameid, userid, pieceid, coordinate_x, coordinate_y, alive)
                                    VALUES
                                    ($1, $2, $3, $4, $5, $6);`;

        db.tx(t1 => {
            return t1.one(sqlCreateGame)
                        .then(newGameRecord => {
                            const queries = [];
                            const gameId  = newGameRecord['id'];

                            const specialPieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
                            const armyDetails   = [  {faction: "white", pawnRowNum: '2', specialRowNum: '1'},
                                                     {faction: "black", pawnRowNum: '7', specialRowNum: '8'}  ];
                            
                            queries.push(t1.one(sqlSelectGame, gameId));
                            queries.push(t1.any(sqlCreateGameUser, [gameId, userId]));
                            
                            for (let armyDetailsIdx = 0; armyDetailsIdx < armyDetails.length; armyDetailsIdx++) {
                                for (let offset = 0; offset < 8; offset++) {
                                    const alphaRow      = String.fromCharCode(97 + offset);
                                    const faction       = armyDetails[armyDetailsIdx].faction;
                                    const pawnRowNum    = armyDetails[armyDetailsIdx].pawnRowNum;
                                    const specialRowNum = armyDetails[armyDetailsIdx].specialRowNum;

                                    queries.push(
                                        t1.one(sqlGetPieceId, ['pawn', faction])
                                            .then(pieceRecord => {
                                                const pieceId = pieceRecord['id'];

                                                return t1.any(sqlCreateGamePiece, [gameId, userId, pieceId, alphaRow, pawnRowNum, true])
                                            })
                                        ,
                                        t1.one(sqlGetPieceId, [specialPieces[offset], faction])
                                            .then(pieceRecord => {
                                                const pieceId = pieceRecord['id'];

                                                return t1.any(sqlCreateGamePiece, [gameId, userId, pieceId, alphaRow, specialRowNum, true])
                                            })
                                        );
                                    }
                            }

                            return t1.batch(queries);
                        })
                        .then((batchResults) => {
                            const gameId = batchResults[0].id;  // gameId SELECT was first pushed into queries{}
                            gameIdCallback(gameId);
                        })
        })
        .catch(error => {
            console.log(error);
        })
    }

    /**
     * Retrieve the desired records from 
     * @param {Number} gameId - The game ID to identify the all the records in the game_pieces table.
     * @param {Function} callbackFunction - The callback function to return the game_piece records to.
     */
    getGamePiecesFromGame(gameId, callbackFunction) {
        const sqlGetFromGamePieces = `SELECT * FROM game_pieces WHERE gameid=($1)`;

        db.any(sqlGetFromGamePieces, [gameId])
            .then(gamePieceRecords => {
                callbackFunction(gamePieceRecords);
            });
    }

    /**
     * Initialize records in the game_pieces table to their respective default coordinates.
     * @param {Number} gameId 
     */
    initializeGamePieces(gameId) {
        const sqlGetPiecesFrom = `SELECT * FROM game_pieces WHERE gameid=($1)`;

        db.tx(t => {

        });
    }

}

module.exports = GamesDB;