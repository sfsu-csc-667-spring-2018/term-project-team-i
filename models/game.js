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
        this.active = gameData.active;
        this.opponentId = gameData.opponentid;
        this.turn = gameData.turn;
        /** @type {Piece[]} */
        this.gamePiecesObjects = this.__setupGamePieces(gamePiecesRecords);
        /** 
         * The chessboard is a [x][y] array of numerical indices (0-7) reflecting 
         * the ascii 'a'-'h' and '1'-'8' respectively, where each index represents a cell
         * that may or may not have a Piece.
         * @see Piece
         */
        //this.chessboard = this.__setupChessboardGamePieces(this.gamePiecesObjects);
        this.chessboard = this.__setupChessboard();
        this.__setupChessboardGamePieces(this.gamePiecesObjects);
        this.kings = this.__getKings(this.chessboard);
    }

    /**
     * Retrieve the King Pieces of this game.
     * @param {Array[]} chessboard The chessboard containing all the current alive game Pieces.
     * @return {{white: King, black: King}} An object with the two King pieces of this game.
     */
    __getKings(chessboard) {
        /** @type {King} */
        const kings = { white: "", black: ""};

        for (let x = 0; x < chessboard.length; x++) {
            for (let y = 0; y < chessboard[x].length; y++) {
                const targetKing = chessboard[x][y];

                if (targetKing && (targetKing instanceof King)) {
                    kings[targetKing.faction] = targetKing;
                }
            }
        }

        return kings;
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
            gamePieces.push(this.getInitializeGamePiece(gamePieceRecord));
        }

        return gamePieces;
    }

    getInitializeGamePiece(gamePieceRecord) {
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

        return gamePieceObject;
    }

    __setupChessboard(dimension = 8) {
        const chessboard = [];

        for (let idx = 0; idx < dimension; idx++ ) {
            chessboard[idx] = [];
        }

        return chessboard;
    }

    /**
     * Set up the chessboard with Pieces at their respective cell locations.
     * @param {Array} gamePiecesObjects Array of Piece objects.
     * @param {Number} dimension Optional dimension size of height and width of this chessboard.
     * @return {Array} A chessboard [x][y] where the cells either contain a Piece or undefined for nothing.
     */
    __setupChessboardGamePieces(gamePiecesObjects, dimension = 8) {
        if (gamePiecesObjects) {
            for (let idx = 0; idx < gamePiecesObjects.length; idx++ ) {
                /** @type {Piece} */
                const gamePiece = gamePiecesObjects[idx];
                this.setChessboardGamePiece(gamePiece);
            }
        }
    }

    setChessboardGamePiece(gamePieceObject) {
        const gamePiece = gamePieceObject;

        if (gamePiece.alive) {
            const chessboard_x = Piece.coordinateXConversion(gamePiece.raw_coordinate_x);
            const chessboard_y = Piece.coordinateYConversion(gamePiece.raw_coordinate_y);
            this.chessboard[chessboard_x][chessboard_y] = gamePiece;
        }
    }

    /**
     * Retrieves the Piece from the chessboard at the given indices.
     * @param {Number} convertedX The numerical x-coordinate position of the desired piece to find.
     * @param {Number} convertedY The numerical y-coordinate position of the desired piece to find.
     */
    __getGamePieceByConvertedCoordinates(convertedX, convertedY) {
        for (let idx = 0; this.gamePiecesObjects.length; idx++) {
            const gamePiece = this.gamePiecesObjects[idx];
            const x = gamePiece.raw_coordinate_x;
            const y = gamePiece.raw_coordinate_y;

            if (x == convertedX && y == convertedY) {
                return gamePiece;
            }
        }
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
    tryMovePieceToPosition(pieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, optionalData) {
       
        let result = {result: false, message: "Cannot process move request at this time!", upgradePawn: false};
        const cbx = Piece.coordinateXConversion(raw_coordinate_x);
        const cby = Piece.coordinateYConversion(raw_coordinate_y);
        const dbx = Piece.coordinateXConversion(raw_destination_x);
        const dby = Piece.coordinateYConversion(raw_destination_y);
        /** @type {Piece} */
        const selectedPiece = this.chessboard[cbx][cby];
        /** @type {Piece} */
        const destinationPiece = this.chessboard[dbx][dby];

        const isOriginInBounds = (cbx >= 0 && cbx <= 7) && (cby >= 0 && cby <= 7);
        const isDestinationInBounds = (dbx >= 0 && dbx <= 7) && (dby >= 0 && dby <= 7);

        // Case: given coordinates are out of bounds.
        if (!isOriginInBounds) {
            result.result = false;
            result.message = `Given piece coordinates {${cbx}, ${cby}} are not within bounds!`;
            return result;
        }
        
        // Case: destination coordinates out of bounds.
        if (!isDestinationInBounds) {
            result.result = false;
            result.message = `Positions {${raw_destination_x}, ${raw_destination_y}} are out of bounds!`;
            return result;
        }
        
        // Case: selected piece does not exist at given location.
        if (!selectedPiece) {
            result.result = false;
            result.message = `Selected piece does not exist at positions {${raw_coordinate_x}, ${raw_coordinate_y}}!`;
            return result;
        }

        // Case: selected piece and destination containing a piece are of the same faction.
        if (selectedPiece && destinationPiece && selectedPiece.faction == destinationPiece.faction) {
            result.result = false;
            result.message = `Cannot capture targeted piece of the same faction!`;
            return result;
        }

        result = selectedPiece.isValidMovement(dbx, dby, this.chessboard);
        console.log(JSON.stringify(result));
        // Case: selected piece cannot move to location; or it can.
        if (!result.result) {
            result.result = false;
            result.message = `Invalid movement to {${raw_destination_x}, ${raw_destination_y}}!`;
        } else {
            result.result = true;
            result.message = "";

            //white pawn upgrade
            // Update the database
            gamesDB.setGamePieceCoordinates(this.gameId, pieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, () => {});


            // Update information locally to reflect the changes.
            this.chessboard[cbx][cby] = undefined;
            this.chessboard[dbx][dby] = selectedPiece;
            
            selectedPiece.raw_coordinate_x = raw_destination_x;
            selectedPiece.raw_coordinate_y = raw_destination_y;

            if(pieceId == 1 && selectedPiece.raw_coordinate_y == '8')
                result.upgradePawn = true;
            else if(pieceId == 7 && selectedPiece.raw_coordinate_y == '1')
                result.upgradePawn = true;
            else
                result.upgradePawn = false;

            if (destinationPiece) {
                destinationPiece.alive = false;
                destinationPiece.raw_coordinate_x = null;
                destinationPiece.raw_coordinate_y = null;
            }
        }

        /** @type {King} */
        const king = this.kings[this.turn];
        const kingCheckResult = king.isKingCheckOrMated(this.chessboard);

        if (kingCheckResult.check && !kingCheckResult.checkmate) {
            result = kingCheckResult;
            result.result = false;
            console.log("KING CHECKED: " + result.message);
        } else if (kingCheckResult.checkmate) {
            //this.active = false;
            result = kingCheckResult;
            result.result = false;
            console.log("KING CHECKMATE: " + result.message);
        }
        
        //console.log(result.message);
        
        return result;
    }

}

module.exports = Game;