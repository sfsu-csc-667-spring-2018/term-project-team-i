const express = require("express");
const handlebars = require('express-handlebars');
const GamesDB = require('../db/gamesDB.js');
const GameManager = require('../models/gameManager.js');
const GamesHbsHelpers = require('../routes/gamesControllers/gamesRenderHelpers.js');
const GameMoveValidator = require('../routes/gamesControllers/gameMoveValidator.js');
const Game = require('../models/game.js');
const router = express.Router();
const gamesDB = new GamesDB();
const gameManager = new GameManager();
const gameMoveValidator = new GameMoveValidator();
const auths = require('../auth/authenticate');
const gameAuth = require('../auth/gameAuth');

const activeGames = new Map();

// Create new game room. req.body = {playerId: int}
router.post('/', auths, (req, res, next) => {
    const playerId = req.user.id;

    gameManager.createGameInstance(playerId, 'white', (gameId) => {
        res.redirect('/games/'+gameId);
    });
});

// Join a game room. req.params = {"gameId": int} req.body = {playerId: int}
router.get('/:gameId', auths, (req, res, next) => {
    const playerId = req.user.id;
    const gameId = req.params.gameId;
    const renderData = {};

    gameManager.getGameInstance(gameId, (returnedGameInstance) => {
        /** @type {Game} */
        const gameInstance = returnedGameInstance;
        const gameHostId = gameInstance.hostId;
        const gameOpponentId = gameInstance.opponentId;

        const funcSuccess = () => {

            // Game room Socket protocols
            res.app.get('io').of('/games/' + gameId).on('connection',socket =>{
                socket.on('disconnect', () => {
                    console.log("Player left + " + playerId);
                });
            });

            renderData.helpers = GamesHbsHelpers.getHandlebarHelpers();
            renderData.gamePieces = GamesHbsHelpers.toCellGamePieceObject(gameInstance.gamePiecesRecords);
            renderData.gameId = gameId;

            res.render('games',renderData);
        }

        const funcFailure = () => {
            req.flash('error_msg', 'You are not allowed in this game');
            res.redirect('/');
        }


        if (gameHostId == playerId || gameOpponentId == playerId) {
            funcSuccess();
        } else if (gameHostId != playerId && gameOpponentId == null) {
            gameInstance.setOpponentID(playerId);
            funcSuccess();
        } else {
            funcFailure();
        }
    });

});

// Sends a message in the Game Room.
router.post('/:gameId/message', auths, (req, res, next) => {
    const gameId = req.params.gameId;
    console.log(gameId);

    const message = req.body.gameMessage;
    console.log('POSTED MESSAGE ' + message);
    const user = req.user.username;
    console.log(user);

    //const indexRoute = request.app.get('io').of('/');
    res.app.get('io').of('/games/' + gameId).emit('new game message',
       {gameUser: user, gameMsg: message});
    // {playerId: int, message: string}
});

// Moves a piece to position
router.post('/:gameId/move-piece', auths, (req, res, next) => {
    // {playerId: int, pieceid: int, coordinate_x: string, coordinate_y: string, destination_x, destination_y}

    const playerId = req.user.id;
    const gameId = req.params.gameId;
    const pieceId = req.body.pieceId;
    const coordinate_x = req.body.coordinate_x;
    const coordinate_y = req.body.coordinate_y;
    const destination_x = req.body.destination_x;
    const destination_y = req.body.destination_y;

    gamesDB.getGamePiecesAlive(gameId, (gamePieceRecordsJOINED) => {
        const moveValidation = gameMoveValidator.validateMovement(gamePieceRecordsJOINED, playerId, destination_x, destination_y);

        if (moveValidation.result) {
            gamesDB.getGameUsers(gameId, (gameUserRecord) => {
                gamesDB.setGamePieceCoordinates(gameId, pieceId, coordinate_x, coordinate_y, destination_x, destination_y, () => {
                    gamesDB.getGamePiecesAlive(gameId, (gamePieceRecords) => {
                        res.statusCode = 200;
                        res.app.get('io').of('/games/' + gameId).emit('chessboard-refresh', {updatedChessPieces: gamePieceRecords});
                        res.end("Move completed");
                    });
                });
            });
        } else {
            console.log(moveValidation.message);
        }
    });

    /*
    new Promise((resolve, reject) => {
        gamesDB.getGamePiecesAlive(gameId, (gamePieceRecordsJOINED) => {
            resolve(gamePieceRecordsJOINED);
        });
    })
    .then((gamePieceRecordsJOINED) => {
        console.log("GAME RECORDS RECEIVED");
        const promise = new Promise((resolve, reject) => {
            const moveValidation = gameMoveValidator.validateMovement(gamePieceRecordsJOINED, playerId, destination_x, destination_y);

            if (moveValidation.result) {
                resolve();
            } else {
                reject(moveValidation.message);
            }
        });

        return promise;
    })
    .then(() => {
        // Check for valid user.
        const promise = new Promise((resolve, reject) => {
            gamesDB.getGameUsers(gameId, (gameRecord => {
                resolve(gameRecord);
            }));
        })

        return promise;
    })
    .then((gameRecord) => {
        const promise = new Promise((resolve, reject) => {
            gamesDB.setGamePieceCoordinates(gameId, pieceId, coordinate_x, coordinate_y, destination_x, destination_y, () => {
                resolve();
            });
        })
        
        return promise;
    })
    .then(() => {
        const promise = new Promise((resolve, reject) => {
            gamesDB.getGamePiecesAlive(gameId, (gamePieceRecords => {
                resolve(gamePieceRecords);
            }))
        })
        
        return promise;
    })
    .then((gamePieceRecords) => {
        res.statusCode = 200;
        res.app.get('io').of('/games/' + gameId).emit('chessboard-refresh', {updatedChessPieces: gamePieceRecords});
        res.end("Move completed!");
    })
    .catch(error => {
        res.statusCode = 400;
        res.send(error);
    });
    */
    //res.end("TEST RESPONSE Got it: " + JSON.stringify(req.body));
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
