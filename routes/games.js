const express = require("express");
const GamesDB = require('../db/gamesDB.js')
const gamesHbsHelpers = require('../routes/gamesControllers/gamesHbsHelpers.js')
const router = express.Router();
const gamesDB = new GamesDB();
const activeGames = {};


const gamesRequestFunction = (req, res, next) => {
    if (req.user === undefined || req.user.id === undefined) {
        // TODO: this is a stop gap measure, route this appropriately.
        res.end("Player ID undefined.");
        return;
    }

    const playerId = req.user.id;
    const renderData = {};

    renderData.helpers = gamesHbsHelpers;

    gamesDB.createGame(playerId, (gameId) => {
        gamesDB.getAllGamePiecesFrom(gameId, (gamePieceRecords) => {
            gamesDB.getAllPieces(pieceRecords => {

                const returnGamePieces = {};
                const pieces = {};

                // SUGGESTION: use a sql JOIN statement instead of aggregating pieces server side as an array after SELECT.
                for (let jdx = 0; jdx < pieceRecords.length; jdx++) {
                    pieces[pieceRecords[jdx].id] = {
                        name: pieceRecords[jdx].name,
                        faction: pieceRecords[jdx].faction
                    };
                }

                // Sets the returning elements 
                for (let idx = 0; idx < gamePieceRecords.length; idx++) {
                    const gamePiece = gamePieceRecords[idx];
                    const pieceid = gamePiece.pieceid;
                    const coordinate_xy = gamePiece.coordinate_x + gamePiece.coordinate_y;
                    const alive = gamePiece.alive;
                    
                    if (alive) {
                        returnGamePieces[coordinate_xy] = {
                            name: pieces[pieceid].name,
                            faction: pieces[pieceid].faction
                        };
                    }
                }

                renderData.gamePieces = returnGamePieces;
                res.render('games', renderData);

            })
        })
    });
    
    // TODO: check if Player has logged in first, otherwise REDIRECT to login screen.
    // TODO: REDIRECT Player to /:gameId where id is the newGameId. This is effectively a Player join a game now.
    // TODO: replace this with official response later.
};

// ********************
//      Routes
// ********************

router.get('/', gamesRequestFunction);

// Create new game room. req.body = {playerId: int}
router.post('/', gamesRequestFunction);

// Join a game room. req.params = {"gameId": int} req.body = {playerId: int}
router.post('/:gameId', (req, res, next) => {
    
    /*
    1. Use the given gameId to pass off the information to an appropriate handler.
    2. Get from database all the pieces that belongs to the game.
    2. Process each record to place each piece in accordance to its location on the screen.
    3. Send the rendered information to the user.
    4. 
    */
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


    gamesDB.getAllGamePiecesFrom(req.params.gameId, (gamePieceRecords) => {
        for (let row = 0; row < gamePieceRecords.length; row++) {
            let gamePieceRecord = gamePieceRecords[row];
            let coordinate_xy = gamePieceRecord.coordinate_x + gamePieceRecord.coordinate_y;

            handlebarsData.coordinate_xy = coordinate_xy;
        }
    });

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
    res.end("Got it: " + req.body);
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
