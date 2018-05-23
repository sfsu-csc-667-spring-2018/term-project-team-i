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
        this.__initialize(gamePiecesRecords);
        this.kings = this.getKings(this.chessboard);
    }

    __initialize(gamePiecesRecords) {
        /** 
         * The chessboard is a [x][y] array of numerical indices (0-7) reflecting 
         * the ascii 'a'-'h' and '1'-'8' respectively, where each index represents a cell
         * that may or may not have a Piece.
         * @see Piece
         */
        this.chessboard = [];
        const gamePieces = [];       // Piece objects.

        // Initialize #x# chessboard.
        for (let x = 0; x < 8; x++) {
            this.chessboard[x] = [];
        }

        // Initialize an array of Piece objects.
        for (let i = 0; i < gamePiecesRecords.length; i++ ) {
            const gamePieceRecord = gamePiecesRecords[i];
            gamePieces.push(this.createGamePieceInitByDBRecord(gamePieceRecord));
        }

        // Add each game Piece onto the chessboard.
        for (let i = 0; i < gamePieces.length; i++ ) {
            /** @type {Piece} */
            const gamePiece = gamePieces[i];
            if (gamePiece && gamePiece.alive) {
                const gpx = gamePiece.coordinateXConverted;
                const gpy = gamePiece.coordinateYConverted;
                this.chessboard[gpx][gpy] = gamePiece;
            }
        }
        
    }

    /**
     * Retrieve the King Pieces of this game.
     * @param {Array[]} this.chessboard The chessboard containing all the current alive game Pieces.
     * @return {{white: King, black: King}} An object with the two King pieces of this game.
     */
    getKings() {
        /** @type {King} */
        const kings = { white: "", black: ""};

        for (let x = 0; x < this.chessboard.length; x++) {
            for (let y = 0; y < this.chessboard[x].length; y++) {
                const targetKing = this.chessboard[x][y];

                if (targetKing && (targetKing instanceof King)) {
                    kings[targetKing.faction] = targetKing;
                }
            }
        }

        return kings;
    }

    /**
     * Returns a new Piece object based on the given information in the game Piece record.
     * @param {{gameid: number, pieceid: number, userid: number, coordinate_x: string, coordinate_y: string, alive: boolean, name: string, faction: string}[]} gamePieceRecord 
     * A single JOINED record from the game_pieces and pieces table pertaining to one piece with the same piece ID referenced in both.
     * @return {Piece}
     */
    createGamePieceInitByDBRecord(gamePieceRecord) {
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

    /**
     * Gets all the game Pieces that are alive on the chessboard.
     * @return {Piece[]} An array of all the living game Pieces on the chessboard.
     */
    getGamePiecesAllOnBoard() {
        const gamePieces = [];

        for (let i = 0; i < this.chessboard.length; i++) {
            for (let j = 0; j < this.chessboard[i].length; j++) {
                const piece = this.chessboard[i][j];

                if (piece) {
                    gamePieces.push(piece);
                }
            }
        }

        return gamePieces;
    }

    /**
     * Retrieve the Piece of the specified ID.
     * @param {Number} pieceId The Piece ID to identify the Piece to find.
     */
    getGamePieceByID(pieceId) {
        const targetGamePiece = undefined;
        const gamePieces = this.getGamePiecesAllOnBoard();

        for (let i = 0; i < gamePieces.length; i++) {
            const curGamePiece = gamePieces[i];
            if (curGamePiece && curGamePiece.pieceId == pieceId) {
                targetGamePiece = curGamePiece;
                break;
            }
        }

        return targetGamePiece;
    }

    /**
     * Get the Piece from the chessboard by the given raw x-y coordinates.
     * @param {String} raw_coordinate_x The string x coordinate reflected on the chessboard.
     * @param {String} raw_coordinate_y The string y coordinate reflected on the chessboard.
     * @return {Piece} The Piece or undefined found by the given coordinates.
     */
    getGamePieceByRawCoordinates(raw_coordinate_x, raw_coordinate_y) {
        const convertedX = Piece.coordinateXConversion(raw_coordinate_x);
        const convertedY = Piece.coordinateYConversion(raw_coordinate_y);

        return this.getGamePieceByConvertedCoordinates(convertedX, convertedY);
    }

    /**
     * Retrieves the Piece from the chessboard at the given indices.
     * @param {Number} convertedX The numerical x-coordinate position of the desired piece to find.
     * @param {Number} convertedY The numerical y-coordinate position of the desired piece to find.
     */
    getGamePieceByConvertedCoordinates(convertedX, convertedY) {
        for (let idx = 0; this.getGamePiecesAllOnBoard.length; idx++) {
            const gamePiece = this.getGamePiecesAllOnBoard[idx];
            const x = gamePiece.raw_coordinate_x;
            const y = gamePiece.raw_coordinate_y;

            if (x == convertedX && y == convertedY) {
                return gamePiece;
            }
        }
    }

    /**
     * Sets the given game Piece onto the chessboard.
     * @param {Piece} gamePiece The game piece to place onto the board. Its internal coordinate values will be used.
     */
    setGamePieceOnChessboard(gamePiece) {
        if (gamePiece && gamePiece.alive) {
            const chessboard_x = Piece.coordinateXConversion(gamePiece.raw_coordinate_x);
            const chessboard_y = Piece.coordinateYConversion(gamePiece.raw_coordinate_y);
            this.chessboard[chessboard_x][chessboard_y] = gamePiece;
        }
    }

    /**
     * Upgrades the given Pawn piece into another specified Piece.
     * @param {Number} userId The User of whom is trying to upgrade the given pawn.
     * @param {Number} target_pieceId The Piece ID of which to convert to the type by given name.
     * @param {String} target_raw_coordinate_x The string x coordinate to identify the pawn.
     * @param {String} target_raw_coordinate_y The string y coordinate to identify the pawn.
     * @param {String} pieceNameToUpgradeTo The name of the piece type to upgrade to ['queen', 'bishop', 'rook', 'knight'].
     * @param {Function} successfulCB The callback function of which to return the object {result: Boolean, message: String, chessboardPieces: Piece[]}.
     * @param {Function} failureCB The callback fucntion to call should the upgrade result in failure.
     */
    setPawnUpgrade(userId, target_pieceId, target_raw_coordinate_x, target_raw_coordinate_y, pieceNameToUpgradeTo, successfulCB, failureCB) {
        const result = {result: false, message: "", chessboardPieces: {}};
        const tPieceId = target_pieceId;
        const tRawX = target_raw_coordinate_x;
        const tRawY = target_raw_coordinate_y;
        const upgradeName = pieceNameToUpgradeTo;

        const pawnPiece = this.getGamePieceByRawCoordinates(target_raw_coordinate_x, target_raw_coordinate_y);

        if (pawnPiece) {
            gamesDB.setPawnUpgrade(this.gameId, userId, tPieceId, upgradeName, tRawX, tRawY, (newGamePieceRecord) => {
                const newPiece = this.createGamePieceInitByDBRecord(newGamePieceRecord);
                this.setGamePieceOnChessboard(newPiece);

                result.result = true;
                result.message = "Successful upgrade!";
                result.chessboardPieces = this.getGamePiecesAllOnBoard();

                successfulCB(result);
            });
        } else {
            result.result = false;
            result.message = "Unsuccessful upgrade!";
            result.chessboardPieces = this.getGamePiecesAllOnBoard();

            failureCB(result);
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

    setGameActiveState(state, callbackFunction) {
        this.active = state;
        const stateLiteral = (state) ? 'active' : 'not_active';

        gamesDB.setGameActiveState(this.gameId, stateLiteral, () => {
            callbackFunction();
        });

    }

    /**
     * Determines if the Piece of the given piece ID can be moved to the destination position.
     * @param {number} userId The current users' id
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
    tryMovePieceToPosition(userId, pieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, optionalData) {
       
        if (!this.active) {
            const result = {result: false, message: "Game is over! LEAVE!", isGameOver: true};
            return result;
        }

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

        const host = {faction: 'white'};
        const opponent = {faction: 'black'};
       console.log("THE PIECE ID IS " + pieceId);
       console.log("THE PIECE ID IS " + typeof pieceId);

        // TURNS
        if(this.turn === 'black'){
            if(userId === this.hostId && (Number(pieceId) >= 7)) {
                console.log("NOT WHITE TURN");
                result.result = false;
                result.message = `ITS NOT YOUR TURN`;
                return result;
            }
            else if(userId === this.opponentId && (Number(pieceId) >= 7)){
                result = selectedPiece.isValidMovement(dbx, dby, this.chessboard);
            }
        }
        else if(this.turn === 'white') {
            if (userId === this.opponentId && (Number(pieceId) < 7)) {
                console.log("NOT BLACK TURN");
                result.result = false;
                result.message = `ITS NOT YOUR TURN`;
                return result;
            }
            else if(userId === this.hostId && (Number(pieceId) < 7))
                result = selectedPiece.isValidMovement(dbx, dby, this.chessboard);
        }
        /*
        if(this.turn === 'black' && host.faction === 'white' && userId === this.hostId) {
            result.result = false;
            result.message = `ITS NOT YOUR TURN`;
            return result;
        }
        else if(this.turn === 'white' && opponent.faction === 'black' && userId === this.opponentId) {
            result.result = false;
            result.message = `ITS NOT YOUR TURN`;
            return result;
        }*/

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

        //result = selectedPiece.isValidMovement(dbx, dby, this.chessboard);
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
            gamesDB.updateTurn(this.gameId, this.turn, () =>{});

            if(this.turn === 'white')
                this.turn = 'black';
            else if(this.turn === 'black')
                this.turn ='white';

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

        // This now refers to opponent
        /** @type {King} */
        const king = this.kings[this.turn];
        //console.log("KING TURN IS" + this.turn);
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
            this.active = false;
            this.setGameActiveState(false);
        }
        
        //console.log(result.message);
        
        return result;
    }

}

module.exports = Game;