const express = require("express");
const router = express.Router();
const db = require('../db');


function createGame() {
    const sqlCreateGame =   `INSERT INTO games 
                            (active) 
                            VALUES 
                            ('active') 
                            RETURNING id;`;
    //TODO: create new game in the database.
    
    //return data.id;
}

function createGameUsers(gameid, userid) {
    const sqlCreateGameUsers =  `INSERT INTO game_users
                                (gameid, userid)
                                VALUES
                                (${gameid}, ${userid});`;

    //TODO: add game users to database.
}

function createGamePieces(gameid, userid) {
    //TODO: Insert black and white faction set pieces for both players into 'pieces' table.
    const piecesNames = ['pawn', 'king', 'queen', 'bishop', 'knight', 'rook'];
    //------------------------------------------------------------------------------------

    let sqlCreateGamePieces =   `INSERT INTO game_pieces
                                (gameid, pieceid, userid)
                                VALUES
                                (${gameid}, ${currentPiece}, ${userid});`;
}

// Create new game room.
router.post('/', (req, res, next) =>{
    // {playerId: int}
    console.log("We received the id: " + req.params['playerId']);
});

// Join a game room.
router.post('/:gameId', (req, res, next) => {
    // {playerId: int}
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