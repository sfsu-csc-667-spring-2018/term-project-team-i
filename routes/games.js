const express = require("express");
const router = express.Router();
const db = require('../db');


// Create new game room. req.body = {playerId: int}
router.post('/', (req, res, next) =>{

    // TODO: check if Player has logged in first, otherwise REDIRECT to login screen.
    
    const playerId = req.body['playerId'];

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


    db.one(sqlCreateGame)
        .then(sqlCreateGameResult => {
            const newGameId = sqlCreateGameResult['id'];
            db.any(sqlCreateGameUser, [newGameId, playerId])
                .then(() => {
                    
                    const faction = {   white: 'white',
                                        black: 'black'  };

                    const piecesNames = {   pawn:'pawn', 
                                            king:'king', 
                                            queen: 'queen', 
                                            bishop: 'bishop', 
                                            knight: 'knight', 
                                            rook: 'rook'    };
                    
                    // Insert pawn pieces
                    for (let positionOffset = 0; positionOffset < 8; positionOffset++) {
                        const positionAlpha = String.fromCharCode(97 + positionOffset);

                        db.one(sqlCreateChessPiece, [piecesNames.pawn, faction.white])
                            .then(sqlCreateChessPieceResult => {
                                const newPieceId = sqlCreateChessPieceResult['id'];

                                db.any(sqlCreateGamePiece, [newGameId, playerId, newPieceId, positionAlpha, '2', true])
                                    .catch(error => {
                                        console.log('Create Game Piece '+piecesNames.pawn+' ERROR: ', error);
                                    });
                            })
                            .catch(error => {
                                console.log('Create Game Piece Pawn '+piecesNames.pawn+' ERROR: ', error);
                            });
                    }
                    
                    // ------------------INSERT ROOK ---------------------------------
                    db.one(sqlCreateChessPiece, [piecesNames.rook, faction.white])
                        .then(sqlCreateChessPieceResult => {
                            const newPieceId = sqlCreateChessPieceResult['id'];

                            db.any(sqlCreateGamePiece, [newGameId, playerId, newPieceId, 'a', '1', true])
                                    .catch(error => {
                                        console.log('Create Game Piece '+piecesNames.rook+' ERROR: ', error);
                                    });
                        })
                        .catch(error => {
                            console.log('Create Game Piece '+piecesNames.rook+' Left ERROR: ', error);
                        });
                    
                    db.one(sqlCreateChessPiece, [piecesNames.rook, faction.white])
                        .then(sqlCreateChessPieceResult => {
                            const newPieceId = sqlCreateChessPieceResult['id'];

                            db.any(sqlCreateGamePiece, [newGameId, playerId, newPieceId, 'h', '1', true])
                                    .catch(error => {
                                        console.log('Create Game Piece '+piecesNames.rook+' Right ERROR: ', error);
                                    });
                        })
                        .catch(error => {
                            console.log('Create Game Piece '+piecesNames.rook+' Right ERROR: ', error);
                        });
                    // --------------------------------------------------------------
                    // --------------INSERT KNIGHT ----------------------------------
                    db.one(sqlCreateChessPiece, [piecesNames.knight, faction.white])
                        .then(sqlCreateChessPieceResult => {
                            const newPieceId = sqlCreateChessPieceResult['id'];

                            db.any(sqlCreateGamePiece, [newGameId, playerId, newPieceId, 'b', '1', true])
                                    .catch(error => {
                                        console.log('Create Game Piece '+piecesNames.knight+' ERROR: ', error);
                                    });
                        })
                        .catch(error => {
                            console.log('Create Game Piece ' + piecesNames.knight + ' ERROR: ', error);
                        });

                    db.one(sqlCreateChessPiece, [piecesNames.knight, faction.white])
                        .then(sqlCreateChessPieceResult => {
                            const newPieceId = sqlCreateChessPieceResult['id'];

                            db.any(sqlCreateGamePiece, [newGameId, playerId, newPieceId, 'g', '1', true])
                                    .catch(error => {
                                        console.log('Create Game Piece '+piecesNames.knight+' ERROR: ', error);
                                    });
                        })
                        .catch(error => {
                            console.log('Create Game Piece ' + piecesNames.knight + ' ERROR: ', error);
                        });
                    // --------------------------------------------------------------
                    // --------------INSERT BISHOP ----------------------------------
                    db.one(sqlCreateChessPiece, [piecesNames.bishop, faction.white])
                        .then(sqlCreateChessPieceResult => {
                            const newPieceId = sqlCreateChessPieceResult['id'];

                            db.any(sqlCreateGamePiece, [newGameId, playerId, newPieceId, 'c', '1', true])
                                    .catch(error => {
                                        console.log('Create Game Piece '+piecesNames.bishop+' ERROR: ', error);
                                    });
                        })
                        .catch(error => {
                            console.log('Create Game Piece '+piecesNames.bishop+' ERROR: ', error);
                        });
                    
                    db.one(sqlCreateChessPiece, [piecesNames.bishop, faction.white])
                        .then(sqlCreateChessPieceResult => {
                            const newPieceId = sqlCreateChessPieceResult['id'];

                            db.any(sqlCreateGamePiece, [newGameId, playerId, newPieceId, 'f', '1', true])
                                .catch(error => {
                                    console.log('Create Game Piece '+piecesNames.bishop+' ERROR: ', error);
                                });
                        }).catch(error => {
                            console.log('Create Game Piece '+piecesNames.bishop+' ERROR: ', error);
                        });
                    // --------------------------------------------------------------
                    // --------------INSERT QUEEN ----------------------------------
                    db.one(sqlCreateChessPiece, [piecesNames.queen, faction.white])
                        .then(sqlCreateChessPieceResult => {
                            const newPieceId = sqlCreateChessPieceResult['id'];

                            db.any(sqlCreateGamePiece, [newGameId, playerId, newPieceId, 'd', '1', true])
                                .catch(error => {
                                    console.log('Create Game Piece '+piecesNames.queen+' ERROR: ', error);
                                });
                        }).catch(error => {
                            console.log('Create Game Piece '+piecesNames.queen+' ERROR: ', error);
                        });
                    // ----------------Insert King piece-----------------------------
                    db.one(sqlCreateChessPiece, [piecesNames.king, faction.white])
                        .then(sqlCreateChessPieceResult => {
                            const newPieceId = sqlCreateChessPieceResult['id'];

                            db.any(sqlCreateGamePiece, [newGameId, playerId, newPieceId, 'e', '1', true])
                                .catch(error => {
                                    console.log('Create Game Piece '+piecesNames.king+' ERROR: ', error);
                                });
                        }).catch(error => {
                            console.log('Create Game Piece '+piecesNames.king+' ERROR: ', error);
                        });
                    
                })
                .catch(error => {
                    console.log('Create Game Users ERROR:', error);
                });
            
            //TODO: REDIRECT Player to /:gameId where id is the newGameId. This is effectively a Player join a game now.
        })
        .catch(error => {
            console.log('Create Game ERROR:', error);
        });

    //TODO: replace this with official response later.
    res.send("Go check postgres database.");
});



// Join a game room. req.params = {"gameId": int} req.body = {playerId: int}
router.post('/:gameId', (req, res, next) => {

    /*
    Programming flow:
        -Check Player is logged in.
            If Player is logged in:
                -SELECT * FROM game_users WHERE gameid='gameId' // AND (userid='playerId' OR opponentid='playerId');
                
                    If successful and the record is found (promise) then
                        If ['userid'] == 'playerId'
                            -Player is white (and assumed as original host).
                            -SELECT * FROM game_pieces WHERE gameid='gameId'     //Initialize prior Game state.
                                If no record found then error; Redirect to lobby.

                        Else If ['opponentid'] == NULL || ['opponentid'] == 'playerId'  //'opponent' == NULL also implies the host Player is waiting since the record is destroyed if the host did not wait for an opponent.
                            -Player is black and id is (re)inserted into database as opponent (regardless if it has been set before to cover both cases).
                            -SELECT * FROM game_pieces WHERE gameid='gameId'     //Initialize prior Game state.
                                If no record found then error; Redirect to lobby.
                    Else
                        Redirect to lobby as game creation must happen via Create Game Button.
            Else
                -Redirect to Sign In page.
    */
    
});

// Sends a message in the Game Room.
router.post('/:gameId/message', (req, res, next) => {
    // {playerId: int, message: string}
});

// Moves a piece to position
router.post('/:gameId/move-piece', (req, res, next) => {
    // {playerId: int, pieceId: int, coordinate_x: string, coordinate_y: string}
});

router.post('/:gameId/forfeit', (req, res, next) => {
    // {playerId: int, forfeit: boolean}
});

router.post('/:gameId/draw-request', (req, res, next) => {
    // {playerId: int, draw-request: boolean}
});

router.post('/:gameId/draw-response', (req, res, next) => {
    // {playerId: int, draw-response: boolean}
});

module.exports = router;