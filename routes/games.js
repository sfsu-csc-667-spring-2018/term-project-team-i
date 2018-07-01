const express = require("express");
const handlebars = require('express-handlebars');
const GamesDB = require('../db/gamesDB.js');
const GameManager = require('../models/gameManager.js');
const GamesHbsHelpers = require('../routes/gamesControllers/gamesRenderHelpers.js');
const Game = require('../models/game.js');
const router = express.Router();
const gamesDB = new GamesDB();
const gameManager = new GameManager();
const auths = require('../auth/authenticate');
const gameAuth = require('../auth/gameAuth');

const activeGames = new Map();

router.get('/', auths, (req, res, next) => {
    const playerId = req.user.id;

    gameManager.createGameInstance(playerId, 'white', (gameId) => {
        res.redirect('/games/'+gameId);
    });
})

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

    gameManager.getGameInstance(gameId, 
        (returnedGameInstance) => {
            /** @type {Game} */
            const gameInstance = returnedGameInstance;
            const gameHostId = gameInstance.hostId;
            const gameOpponentId = gameInstance.opponentId;

            const funcSocketProtocols = (res, gameId) => {
                res.app.get('io').of('/games/' + gameId).on('connection',socket =>{
                    socket.on('disconnect', () => {
                        //console.log("Player left + " + playerId);
                    });
                });
            }

            const individualFuncSocketProtocol = (res, gameId) =>{
                res.app.get('io').of('/games/' + gameId + '/' + playerName).on('connection',socket =>{
                    socket.on('disconnect', () => {
                        //console.log("Player left + " + playerName);
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
                renderData.playerFaction = gameInstance.getPlayerFactionByID(playerId);

                res.render('games',renderData);
            }

            const funcFailure = () => {
                req.flash('error_msg', 'You are not allowed in this game');
                res.redirect('/');
            }

            if (gameHostId == playerId) {
                gameInstance.setHostName(playerName);
            }

            if (gameOpponentId == playerId) {
                gameInstance.setOpponentName(playerName);
            }

            if (gameHostId == playerId || gameOpponentId == playerId) {
                funcSuccess();
            } else if (gameHostId != playerId && gameOpponentId == null) {
                gameInstance.setOpponentID(playerId, funcSuccess, funcFailure);
                gameInstance.setOpponentName(playerName);
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
    // {playerId: int, message: string[]}
    const gameId = req.params.gameId;

    const message = req.body.message;
    const user = req.user.username;
    
    res.app.get('io').of('/games/' + gameId).emit('socket-chat-message',
    {chatUser: stripHTML(user), chatMessage: stripHTML(message)});

    res.statusCode = 200;
    res.end();
});

// Moves a piece to position
router.post('/:gameId/move-piece', auths, (req, res, next) => {
    // {playerId: int, pieceid: int, coordinate_x: string, coordinate_y: string, destination_x, destination_y}

    const playerId = req.user.id;
    const playerName = req.user.username;
    const gameId = req.params.gameId;
    const pieceId = req.body.pieceId;
    const raw_coordinate_x = req.body.coordinate_x;
    const raw_coordinate_y = req.body.coordinate_y;
    const raw_destination_x = req.body.destination_x;
    const raw_destination_y = req.body.destination_y;
    const pawnUpgradeName = req.body.pawnUpgradeName;

    gameManager.getGameInstance(gameId, 
        (gameInstance) => {

            /** @type {Game} */
            const game = gameInstance;
            const hostPlayerTurn = {host: game.hostId, userId: playerId};
            const opponentPlayer = game.opponentId;

            if (game.active) {

                if(game.opponentId === null ){
                    console.log("GAME NOT READY YET");
                } else {

                    const moveResult = game.tryMovePieceToPosition(playerId, pieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, {pawnUpgradeName: pawnUpgradeName});
                    const gamePieces = game.getGamePiecesAllOnBoard();
                    const resStatusCode = (moveResult.result) ? 200 : 304;

                    res.statusCode = resStatusCode;
                    res.app.get('io').of('/games/' + gameId).emit('skt-chess-board-refresh', {updatedChessPieces: gamePieces});
                    res.app.get('io').of('/games/' + gameId + '/' + playerName).emit('skt-chess-move-piece-message', {message: moveResult.message});

                    if (moveResult.isUpgradingPawn == true) {
                        res.app.get('io').of('/games/' + gameId + "/" + playerName).emit('skt-chess-upgrade-pawn', {
                            playerName: playerName,
                            pieceId: pieceId,
                            raw_coordinate_x: raw_coordinate_x,
                            raw_coordinate_y: raw_coordinate_y,
                            raw_destination_x: raw_destination_x,
                            raw_destination_y: raw_destination_y
                        });
                    }
                    //res.end(moveResult.message);
                    res.end("Success");
                }
            } else {
                // GAME OVER CODE
                res.app.get('io').of('/games/' + gameId).emit('game-ended', {data: "GAME OVER"});
                res.end();
            }
        },
        (failureCB) => {
            console.log(failureCB);
            res.end("Cannot move piece!");
        });

});

router.post('/:gameId/forfeit', (req, res, next) => {
    // {playerId: int, forfeit: boolean}
    const gameId =  Number(req.params.gameId);
    const gameUsername = req.body.gameUsername;

    gameManager.getGameInstance(gameId,
        (gameInstance) => {
            /** @type {Game} */
            const game = gameInstance;

            game.setGameActiveState(false, () => {
                // GAME OVER CODE
                res.app.get('io').of('/games/' + gameId).emit('game-ended', {data: `Game Over! ${gameUsername} has forfeited!`});
                res.end();
            })
        },  
        () => {
            res.end();
        }
    )
});


router.post('/:gameId/draw-request', (req, res, next) => {
    // {playerId: int, draw-request: boolean}
    
    const playerId = req.user.id;
    const playerName = req.user.username;
    const gameId = req.params.gameId;
    
    gameManager.getGameInstance(gameId, (gameInstance) => {
        /** @type {Game} */
        const game = gameInstance;
        const otherPlayerName = game.getOtherPlayerByName(playerName);

        res.app.get('io').of('/games/' + gameId + '/' + otherPlayerName).emit('skt-chess-opponent-draw-request');
        res.end();
    },
    () => {
        res.end();
    });
});

router.post('/:gameId/draw-response', (req, res, next) => {
    // {playerId: int, draw-response: boolean}

    const playerName = req.user.username;
    const gameId = req.params.gameId;
    const drawResponse = req.body.response;

    gameManager.getGameInstance(gameId, (gameInstance) => {
        /** @type {Game} */
        const game = gameInstance;
        const otherPlayerName = game.getOtherPlayerByName(playerName);

        if (drawResponse == 'true') {
            game.setGameActiveState(false, () => {
                res.app.get('io').of('/games/' + gameId + '/' + otherPlayerName).emit('skt-chess-opponent-draw-response', {response: drawResponse});
                res.end();      
            })
        } else {
            res.app.get('io').of('/games/' + gameId + '/' + otherPlayerName).emit('skt-chess-opponent-draw-response', {response: drawResponse});
            res.end();
        }

    },
    () => {
        res.app.get('io').of('/games/' + gameId + '/' + otherPlayerName).emit('skt-chess-opponent-draw-response', {response: false});
        res.end();
    });
});

module.exports = router;
