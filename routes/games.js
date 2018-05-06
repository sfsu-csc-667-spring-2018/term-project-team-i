const express = require("express");
const GamesDB = require('../db/gamesDB.js')
const GamesController = require('../routes/gamesControllers/gamesController.js');
const gamesHbsHelpers = require('../routes/gamesControllers/gamesHbsHelpers.js');
const router = express.Router();
const gamesController = new GamesController();
const gamesDB = new GamesDB();
const activeGames = {};


// Create new game room. req.body = {playerId: int}
router.post('/', (req, res, next) => {
    // TODO: check if Player has an ID/exists via req.user.id
    // TODO: check if Player has logged in first, otherwise REDIRECT to login screen.
    // TODO: REDIRECT Player to /:gameId where id is the newGameId. This is effectively a Player join a game now.
    // TODO: replace this with official response later.
    
    const playerId = req.user.id;
    gamesDB.createNewGame(playerId, 'white', (gameId) => {
        //res.end('/games/'+gameId);
        res.redirect('/games/'+gameId);  
    });
});

// Join a game room. req.params = {"gameId": int} req.body = {playerId: int}
router.get('/:gameId', (req, res, next) => {
    const gameId = req.params.gameId;
    const renderData = {};

    console.log("The game ID is: " + gameId);

    renderData.helpers = gamesHbsHelpers;

    gamesDB.getAllGamePiecesFrom(gameId, (gamePieceRecords) => {
        gamesDB.getAllPieces(pieceRecords => {
            renderData.gamePieces = gamesController.getChessPiecesArray(gamePieceRecords, pieceRecords);
            renderData.gameId = gameId;
            res.render('games',renderData);
        });
    })

    /*
    1. Use the given gameId to pass off the information to an appropriate handler.
    2. Get from database all the pieces that belongs to the game.
    2. Process each record to place each piece in accordance to its location on the screen.
    3. Send the rendered information to the user.
    4. 
    */

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
router.post('/:gameId/move-piece', (req, res, next) => {
    // {playerId: int, pieceId: int, coordinate_x: string, coordinate_y: string}
    res.end("TEST RESPONSE Got it: " + JSON.stringify(req.body));
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
