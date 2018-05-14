const GamesDB = require('../db/gamesDB.js');
const Piece = require('../models/chess_pieces/piece.js');
const gamesDB = new GamesDB();

class Game {

    /**
     * A Game instance representing a record the details reflected in the
     * database. This Game class will handle the transaction required in updating
     * any record pertaining to this instance of the game.
     * @param {Object} gameData An object of representing a record joined between games and game_users
     * belonging to a certain game ID.
     * @param {Array} gamePiecesRecords An array of objects where each object is a record joined
     * from the pieces and game_pieces table from a certain game ID.
     */
    constructor (gameData, gamePiecesRecords) {
        this.gameId = gameData.gameid;
        this.hostId = gameData.userid;
        this.opponentId = gameData.opponentid;
        this.turn = gameData.turn;
        this.gamePiecesRecords = gamePiecesRecords;
        this.chessboard = this.__setupChessboard();
        this.gamePieces = this.__setupPiecesObjects(gamePiecesRecords);
        
    }

    __setupChessboard(dimension = 8) {
        const chessboard = [];

        for (let idx = 0; idx < dimension; idx++ ) {
            chessboard[i] = [];
        }

        return chessboard;
    }

    /**
     * Set up internal chessboard that have pieces.
     * @param {Array} gamePiecesRecords 
     */
    __setupPiecesObjects(gamePiecesRecords) {
        for (let idx = 0; idx < gamePiecesRecords.length; idx++ ) {
            const piece = new Piece(gamePiecesRecords[idx]);
            //TODO: merge branch-razmikh to acquire coordinate convert to chessboard positions.
        }
    }

    __isOutOfBounds(destination_x, destination_y) {
        
    }

    /**
     * Set the opponent ID of this game instance. Note that a successful callback must be passed
     * as the game_users database table should reflect the most up to date information.
     * @param {Number} opponentId 
     * @param {Function} successCB Callback to run after success database update.
     * @param {Function} failureCB Optional failure callback.
     */
    setOpponentID(opponentId, successCB, failureCB) {
        gamesDB.setGameOpponent(opponentId, this.gameId, () => {
            this.opponentId = opponentId;
            successCB();
        }, 
        () => {
            if (typeof failureCB === 'function') {
                failureCB();
            }
        });
    }

    movePieceToPosition(pieceId, coordinate_x, coordinate_y, destination_x, destination_y, optionalData) {
        //pieceId, coordinate_x, coordinate_y, newX, newY)

        // Check if move is valid
        /*
            1. Is move out of bounds? Instant reject if so.
            2. Is move even possible by the selected piece?
            3. Is there an intercepting piece disallowing the movement then?
            4. Is there an ally piece at the destination?
            5. Is this current player's king in check?
            6.      Yes: does this new move avoids the capture?
            7. Move the piece to destination... 
        */
        
        
        /*
        let x = coordinate_x.charCodeAt(0) - 'a'.charCodeAt(0);
        let y = Number(coordinate_y) - 1;
        let piece = this.chessboard[x][y];

        if (piece){
            if (!this.__isOutOfBounds(destination_x, destination_y)) {
                //if (piece.isValidMovement(destination_x, destination_y, chessboard))
            }
        }
        */
    }

}

module.exports = Game;