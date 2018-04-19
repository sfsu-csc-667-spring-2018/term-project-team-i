const db = require('../db');

class GamesDB {

    constructor () {
        
    }

    createGame(userId) {
        this.__createGame()
            .then(createGameResult => {
                const gameId = createGameResult['id'];
                this.__createGameUser(gameId, userId)
                    .then(() => {
                        this.__createGamePieces(gameId, userId);
                    })
                    .catch (error => {
                        console.log(error);
                    });
            })
            .catch (error => {
                console.log(error);
            });
    }
    
    __createGame() {
        const sqlCreateGame =  `INSERT INTO games 
                                (active, turn) 
                                VALUES 
                                ('active', 'white') 
                                RETURNING id;`;
        
        return db.one(sqlCreateGame);
    }

    __createGameUser(gameId, userId) {
        const sqlCreateGameUser = ` INSERT INTO game_users
                                    (gameid, userid)
                                    VALUES
                                    ($1, $2);`;

        return db.any(sqlCreateGameUser, [gameId, userId]);
    }

    __createGamePieces(gameId, userId) {

        const specialPieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
        const spawnDetails = [  {faction: "white", pawnSpawnLine: '2', specialSpawnLine: '1'},
                                {faction: "black", pawnSpawnLine: '7', specialSpawnLine: '8'}  ];

        for (let spawnDetailIdx = 0; spawnDetailIdx < spawnDetails.length; spawnDetailIdx++) {
            for (let offset = 0; offset < 8; offset++) {
            
                const positionAlpha = String.fromCharCode(97 + offset);
    
                // INSERT pawn piece records for white
                this.__createChessPiece('pawn', spawnDetails[spawnDetailIdx].faction)
                    .then(createChessPieceResult => {
                        const pieceId = createChessPieceResult['id'];
                        this.__createGamePiece(gameId, userId, pieceId, positionAlpha, spawnDetails[spawnDetailIdx].pawnSpawnLine, true)
                            .catch(error => {
                                console.log('SQL - ERROR for '+this.__createGamePiece.name, error);
                            });
                    })
                    .catch (error => {
                        console.log('SQL - ERROR for '+this.__createGamePieces.name, error);
                    });
                    
                this.__createChessPiece(specialPieces[offset], spawnDetails[spawnDetailIdx].faction)
                    .then(createChessPieceResult => {
                        const pieceId = createChessPieceResult['id'];
                        this.__createGamePiece(gameId, userId, pieceId, positionAlpha, spawnDetails[spawnDetailIdx].specialSpawnLine, true)
                            .catch(error => {
                                console.log('SQL - ERROR for '+this.__createGamePiece.name, error);
                            });
                    })
                    .catch (error => {
                        console.log('SQL - ERROR for '+this.__createGamePieces.name, error);
                    });
            }
        }
    }

    __createChessPiece(name, faction) {
        const sqlCreateChessPiece =   ` INSERT INTO pieces
                                        (name, faction)
                                        VALUES
                                        ($1, $2)
                                        RETURNING id;`;

        return db.one(sqlCreateChessPiece, [name, faction]);
    }

    __createGamePiece(gameId, userId, pieceId, coordinate_x, coordinate_y, alive) {
        const sqlCreateGamePiece = `INSERT INTO game_pieces
                                    (gameid, userid, pieceid, coordinate_x, coordinate_y, alive)
                                    VALUES
                                    ($1, $2, $3, $4, $5, $6);`;

        return db.any(sqlCreateGamePiece, [gameId, userId, pieceId, coordinate_x, coordinate_y, alive]);
    }
}

module.exports = GamesDB;