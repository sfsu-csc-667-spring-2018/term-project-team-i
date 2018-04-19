const db = require('../db');

class GamesDB {

    constructor () {
        
    }

    createGame(userId) {
        const sqlCreateGame =  `INSERT INTO games 
                                (active, turn) 
                                VALUES 
                                ('active', 'white') 
                                RETURNING id;`;

        const sqlCreateGameUser = ` INSERT INTO game_users
                                    (gameid, userid)
                                    VALUES
                                    ($1, $2);`;

        const sqlCreateChessPiece =   ` INSERT INTO pieces
                                        (name, faction)
                                        VALUES
                                        ($1, $2)
                                        RETURNING id;`;

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
                            
                            queries.push(t1.any(sqlCreateGameUser, [gameId, userId]));
                            
                            for (let armyDetailsIdx = 0; armyDetailsIdx < armyDetails.length; armyDetailsIdx++) {
                                for (let offset = 0; offset < 8; offset++) {
                                    const alphaRow      = String.fromCharCode(97 + offset);
                                    const faction       = armyDetails[armyDetailsIdx].faction;
                                    const pawnRowNum    = armyDetails[armyDetailsIdx].pawnRowNum;
                                    const specialRowNum = armyDetails[armyDetailsIdx].specialRowNum;

                                    queries.push(
                                                t1.one(sqlCreateChessPiece, ['pawn', faction])
                                                    .then(newChessPiece => {
                                                        const pieceId = newChessPiece['id'];

                                                        return t1.any(sqlCreateGamePiece, [gameId, userId, pieceId, alphaRow, pawnRowNum, true])
                                                    })
                                                ,
                                                t1.one(sqlCreateChessPiece, [specialPieces[offset], faction])
                                                    .then(newChessPiece => {
                                                        const pieceId = newChessPiece['id'];

                                                        return t1.any(sqlCreateGamePiece, [gameId, userId, pieceId, alphaRow, specialRowNum, true])
                                                    })
                                                );
                                }
                            }

                            return t1.batch(queries);
                        });
        })
        .catch(error => {
            console.log(error);
        })
    }

}

module.exports = GamesDB;