const GamesDB = require('../db/gamesDB.js')
const express = require("express");
const router = express.Router();
const db = require('../db');
const gamesDB = new GamesDB();

// TODO: this is a test route
router.get('/', (req, res, next) =>{

    const handlebarsData = {};

    handlebarsData.helpers = {
        // Add all helper functions here.
        chessboard_setupBlackOrWhiteClass: (blackClass, whiteClass, cellAlpha, cellNumber) => {
            const alphaNumber = cellAlpha.charCodeAt(0);
            const numberNumber = cellNumber;
            const isCellAlphaEven = (alphaNumber % 2 === 0);
            const isCellNumberEven = (cellNumber % 2 === 0);

            return ((isCellAlphaEven && isCellNumberEven) || (!isCellAlphaEven && !isCellNumberEven)) ? whiteClass : blackClass;
        },

        chessboard_setupBorderAscii: (base, increments, count, block) => {
            let accumulate = '';
            for (let idx = 0; idx <= count; idx++) {
                accumulate += block.fn(String.fromCharCode(base));
                base += increments;
            }
            return accumulate;
        }
    }

    res.render('games', handlebarsData);
});

// Create new game room. req.body = {playerId: int}
router.post('/', (req, res, next) =>{
    const playerId = req.user.id;
    const handlebarsData = {};

    handlebarsData.helpers = {
        // Add all helper functions here.
        chessboard_setupBlackOrWhiteClass: (blackClass, whiteClass, cellAlpha, cellNumber) => {
            const alphaNumber = cellAlpha.charCodeAt(0);
            const numberNumber = cellNumber;
            const isCellAlphaEven = (alphaNumber % 2 === 0);
            const isCellNumberEven = (cellNumber % 2 === 0);

            return ((isCellAlphaEven && isCellNumberEven) || (!isCellAlphaEven && !isCellNumberEven)) ? whiteClass : blackClass;
        },

        chessboard_setupBorderAscii: (base, increments, count, block) => {
            let accumulate = '';
            for (let idx = 0; idx <= count; idx++) {
                accumulate += block.fn(String.fromCharCode(base));
                base += increments;
            }
            return accumulate;
        }
    }

    gamesDB.createGame(playerId, (gameId) => {
        res.render('games/'+gameId, handlebarsData);
    });
    
    // TODO: check if Player has logged in first, otherwise REDIRECT to login screen.
    // TODO: REDIRECT Player to /:gameId where id is the newGameId. This is effectively a Player join a game now.
    // TODO: replace this with official response later.
});

// Join a game room. req.params = {"gameId": int} req.body = {playerId: int}
router.post('/:gameId', (req, res, next) => {
    console.log("Reached games. The given id is : " + req.params.gameId);
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
