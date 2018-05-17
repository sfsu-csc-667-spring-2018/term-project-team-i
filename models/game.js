const GamesDB = require('../db/gamesDB.js');
const Piece = require('../models/chess_pieces/piece.js');
const Pawn = require('../models/chess_pieces/pawn.js');
const Rook = require('../models/chess_pieces/rook.js');
const Bishop = require('../models/chess_pieces/bishop.js');
const Knight = require('../models/chess_pieces/knight.js');
const Queen = require('../models/chess_pieces/queen.js');
const King = require('../models/chess_pieces/king.js');

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
        this.gamePieces = this.__setupGamePieces(gamePiecesRecords);
        /** 
         * The chessboard is a [x][y] array of numerical indices reflecting 
         * the ascii 'a'-'h' and '1'-'8' respectively. 
         */
        this.chessboard = this.__setupChessboard(this.gamePieces);
    }

    /**
     * Set up an array of Pieces.
     * @param {Array} gamePiecesRecords Array of objects where each object represents a record that
     * was joined between game and game_users table of a certain game.
     */
    __setupGamePieces(gamePiecesRecords) {
        const gamePieces = [];

        for (let idx = 0; idx < gamePiecesRecords.length; idx++ ) {
            const gamePieceRecord = gamePiecesRecords[idx];
            const gamePieceName = gamePieceRecord.name;
            /** @type {Piece} */
            let gamePieceObject = undefined;
            
            if (gamePieceName == 'pawn') {
                gamePieceObject = new Pawn(gamePieceRecord);
            } else if (gamePieceName == 'rook') {
                gamePieceObject = new Rook(gamePieceRecord);
            } else if (gamePieceName == 'knight') {
                gamePieceObject = new Knight(gamePieceRecord);
            } else if (gamePieceName == 'bishop') {
                gamePieceObject = new Bishop(gamePieceRecord);
            } else if (gamePieceName == 'queen') {
                gamePieceObject = new Queen(gamePieceRecord);
            } else if (gamePieceName == 'king') {
                gamePieceObject = new King(gamePieceRecord);
            } else {
                throw new TypeError(`Error: cannot instantiate ${gamePieceName}`);
            }

            gamePieces.push(gamePieceObject);
        }

        return gamePieces;
    }

    /**
     * Set up the chessboard with Pieces at their respective cell locations.
     * @param {Array} gamePieces Array of Piece objects.
     * @param {Number} dimension Optional dimension size of height and width of this chessboard.
     */
    __setupChessboard(gamePieces, dimension = 8) {
        const chessboard = [];

        for (let idx = 0; idx < dimension; idx++ ) {
            chessboard[idx] = [];
        }

        if (gamePieces) {
            for (let idx = 0; idx < gamePieces.length; idx++ ) {
                /** @type {Piece} */
                const piece = gamePieces[idx];
                const cbx = Piece.coordinateXConversion(piece.raw_coordinate_x);
                const cby = Piece.coordinateYConversion(piece.raw_coordinate_y);

                chessboard[cbx][cby] = piece;
            }
        }

        return chessboard;
    }

    __getGamePieceByCoordinates(convertedX, convertedY) {
        for (let idx = 0; this.gamePieces.length; idx++) {
            const gamePiece = this.gamePieces[idx];
            const x = gamePiece.raw_coordinate_x;
            const y = gamePiece.raw_coordinate_y;

            if (x == convertedX && y == convertedY) {
                return gamePiece;
            }
        }
    }

    /**
     * 
     * @param {Piece} piece 
     * @param {String} raw_coordinate_x 
     * @param {String} raw_coordinate_y 
     * @param {String} raw_destination_x 
     * @param {String} raw_destination_y 
     * @param {Array} chessboard 
     */
    __updatePiecePosition(piece, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, chessboard) {
        const cur_x = piece 
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

    /**
     * Determines if the Piece of the given piece ID can be moved to the destination position.
     * @param {Number} pieceId The piece ID to identify the type of Piece to move.
     * @param {String} raw_coordinate_x The raw x-coordinate passed in from the player 
     * that is used to identify the selected Piece's through its x-coordinate.
     * @param {String} raw_coordinate_y The raw y-coordinate passed in from the player
     * that is used to identify the selected Piece's through its y-coordinate.
     * @param {String} raw_destination_x The raw x-coordinate destination passed in from the player
     * that is used to determine if the selected Piece can move to it.
     * @param {String} raw_destination_y The raw y-coordinate destination passed in from the player
     * that is used to determine if the selected Piece can move to it.
     * @param {Object} optionalData Optional data to be used if needed.
     */
    movePieceToPosition(pieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, optionalData) {
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
        const result = {result: false, message: "Cannot process move request at this time!"};
        const cbx = Piece.coordinateXConversion(raw_coordinate_x);
        const cby = Piece.coordinateYConversion(raw_coordinate_y);
        const dbx = Piece.coordinateXConversion(raw_destination_x);
        const dby = Piece.coordinateYConversion(raw_destination_y);
        const piece = this.__getGamePieceByCoordinates(cbx, cby);

        const isOriginInBounds = (cbx >= 0 && cbx <= 7) && (cby >= 0 && cby <= 7);
        const isDestinationInBounds = (dbx >= 0 && dbx <= 7) && (dby >= 0 && dby <= 7);

        if (!isOriginInBounds) {
            result.result = false;
            result.message = `Given piece coordinates {${cbx}, ${cby}} are not within bounds!`;
        } else if (!isDestinationInBounds) {
            result.result = false;
            result.message = `Positions {${raw_destination_x}, ${raw_destination_y}} are out of bounds!`;
        } else if (!piece) {
            result.result = false;
            result.message = `Selected piece does not exist at positions {${raw_coordinate_x}, ${raw_coordinate_y}}!`;
        } else if (!piece.isValidMovement(dbx, dby, this.chessboard)) {
            result.result = false;
            result.message = `Invalid movement to {${raw_destination_x}, ${raw_destination_y}}!`;
        } else {
            result = true;
            result.message = "";

            gamesDB.setGamePieceCoordinates(this.gameId, pieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, () => {});
            this.chessboard[piece.raw_coordinate_x][piece.raw_coordinate_y] = undefined;
            this.chessboard[raw_destination_x][raw_destination_y] = piece;
            piece.raw_coordinate_x = raw_destination_x;
            piece.raw_coordinate_y = raw_destination_y;
        }

        return result;
    }

}

module.exports = Game;