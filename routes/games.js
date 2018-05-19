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

    gameManager.getGameInstance(gameId, 
        (returnedGameInstance) => {
            /** @type {Game} */
            const gameInstance = returnedGameInstance;
            const gameHostId = gameInstance.hostId;
            const gameOpponentId = gameInstance.opponentId;

            const funcSocketProtocols = (res, gameId) => {
                res.app.get('io').of('/games/' + gameId).on('connection',socket =>{
                    socket.on('disconnect', () => {
                        console.log("Player left + " + playerId);
                    });
                });
            }

            const funcSuccess = () => {
                funcSocketProtocols(res, gameId);

                renderData.helpers = GamesHbsHelpers.getHandlebarHelpers();
                renderData.gamePieces = GamesHbsHelpers.toCellGamePieceObject(gameInstance.gamePiecesObjects);
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
                gameInstance.setOpponentID(playerId, funcSuccess, funcFailure);
            } else {
                funcFailure();
            }
        },
        (failureError) => {
            req.flash('error_msg', "Cannot access game!");
            res.redirect('/');
        });

});

const stripHTML = (text) =>{
    let regex = /(<([^>]+)>)/ig;
    return text.replace(regex, "");
};

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
       {gameUser: stripHTML(user), gameMsg: stripHTML(message)});
    // {playerId: int, message: string}
});

// Moves a piece to position
router.post('/:gameId/move-piece', auths, (req, res, next) => {
    // {playerId: int, pieceid: int, coordinate_x: string, coordinate_y: string, destination_x, destination_y}

    const playerId = req.user.id;
    const gameId = req.params.gameId;
    const pieceId = req.body.pieceId;
    const raw_coordinate_x = req.body.coordinate_x;
    const raw_coordinate_y = req.body.coordinate_y;
    const raw_destination_x = req.body.destination_x;
    const raw_destination_y = req.body.destination_y;

    gameManager.getGameInstance(gameId, 
        (gameInstance) => {
            /** @type {Game} */
            const game = gameInstance;
            const moveResult = game.tryMovePieceToPosition(pieceId, 
                                                            raw_coordinate_x, raw_coordinate_y, 
                                                            raw_destination_x, raw_destination_y);

            const gamePieces = game.gamePiecesObjects;
            const resStatusCode = (moveResult.result) ? 200 : 304;

            res.statusCode = resStatusCode;
            res.app.get('io').of('/games/' + gameId).emit('chessboard-refresh', {updatedChessPieces: gamePieces});
            res.end(moveResult.message);
        },
        (failureCB) => {
            console.log(failureCB);
            res.end("Cannot move piece!");
        });

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
