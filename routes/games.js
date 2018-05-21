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
    const playerName = req.user.username;

    console.log("player name in game is " + playerName + " ID is: " + playerId);

    gameManager.getGameInstance(gameId, 
        (returnedGameInstance) => {
            console.log("REACHED RETURN GAME INSTANCE");
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

            const individualFuncSocketProtocol = (res, gameId) =>{
                res.app.get('io').of('/games/' + gameId + '/' + playerName).on('connection',socket =>{
                    socket.on('disconnect', () => {
                        console.log("Player left + " + playerName);
                    });
                });
            }
            const funcSuccess = () => {
                funcSocketProtocols(res, gameId);
                individualFuncSocketProtocol(res, gameId, playerId);

                renderData.helpers = GamesHbsHelpers.getHandlebarHelpers();
                renderData.gamePieces = GamesHbsHelpers.toCellGamePieceObject(gameInstance.getGamePiecesAllOnBoard());
                renderData.gameId = gameId;
                renderData.playerName = playerName;


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
            console.log("AHHHHHHHHHHHHHHHHHHHH " + failureError);
            req.flash('error_msg', "Cannot access game!");
            res.redirect('/');
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
