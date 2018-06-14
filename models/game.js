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

    getPlayerFactionByID (playerId) {
        let playerFaction;

        if (playerId == this.hostId) {
            playerFaction = 'white';
        } else {
            playerFaction = 'black';
        }

        return playerFaction;
    }

    /**
     * Retrieve the King Pieces of this game.
     * @param {Array[]} chessboard The chessboard containing all the current alive game Pieces.
     * @return {{white: King, black: King}} An object with the two King pieces of this game.
     */
    getKings(chessboard) {
        const realChessboard = (chessboard) ? chessboard : this.chessboard;

        /** @type {King} */
        const kings = { white: "", black: ""};

        for (let x = 0; x < realChessboard.length; x++) {
            for (let y = 0; y < realChessboard[x].length; y++) {
                const targetKing = realChessboard[x][y];

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
    getGamePiecesAllOnBoard(chessboard) {
        const gamePieces = [];
        const realChessboard = (chessboard) ? chessboard : this.chessboard;

        for (let i = 0; i < realChessboard.length; i++) {
            for (let j = 0; j < realChessboard[i].length; j++) {
                const piece = realChessboard[i][j];

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
            if (callbackFunction && (typeof (callbackFunction) == 'function')) {
                callbackFunction();
            }
        });

    }

    /**
     * Determines if the Piece of the given piece ID can be moved to the destination position.
     * @param {number} movingPlayerId The current users' id
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
    tryMovePieceToPosition(movingPlayerId, pieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, optionalData) {

        const isGameOver = (currentGameState) => {
            const result = {result: false, message: ""};
            result.result = (!currentGameState);
            result.message = (!currentGameState) ? `GAME IS OVER!` : ``;

            return result;
        }

        const isMovingPlayerTurn = (movingPlayerId) => {
            const result = {result: false, message: ""};
            const isWhitesTurn = (this.turn == 'white' && movingPlayerId == this.hostId);
            const isBlacksTurn = (this.turn == 'black' && movingPlayerId == this.opponentId);

            if ((isWhitesTurn && !isBlacksTurn) || (!isWhitesTurn && isBlacksTurn)) {
                result.result = true;
                result.message = "";
            } else {
                result.result = false;
                result.message = `${this.turn}: not your turn!`;
            }

            return result;
        }

        const isMovingPieceSelectable = (movingPlayerId, raw_coordinate_x, raw_coordinate_y, chessboard) => {
            const result = {result: false, message: ""};
            const realChessboard = (chessboard) ? chessboard : this.chessboard;
            const cbx = Piece.coordinateXConversion(raw_coordinate_x);
            const cby = Piece.coordinateYConversion(raw_coordinate_y);
            const isSelectionInBounds = (cbx >= 0 && cbx <= 7) && (cby >= 0 && cby <= 7);
            const movingPlayerFaction = (this.turn == 'white' && movingPlayerId == this.hostId) ? 'white' : 'black';

            if (isSelectionInBounds) {
                /** @type {Piece} */
                const selectedPiece = realChessboard[cbx][cby];

                if (selectedPiece) {
                    if (selectedPiece.faction == movingPlayerFaction) {
                        result.result = true;
                        result.message = ``;
                    } else {
                        result.result = false;
                        result.message = `Selected ${selectedPiece.name} at [${raw_coordinate_x}][${raw_coordinate_y}] is not of your faction!`
                    }
                } else {
                    result.result = false;
                    result.message = `Selection {${raw_coordinate_x}, ${raw_coordinate_y}} refers to nothing!`;
                }
            } else {
                result.result = false;
                result.message = `Selected coordinates [${raw_coordinate_x}][${raw_coordinate_y}] is out of bounds!`
            }

            return result;
        }

        const isDestinationInBounds = (destination_x, destination_y) => {
            const result = {result: false, message: ""};
            const dbx = Piece.coordinateXConversion(raw_destination_x);
            const dby = Piece.coordinateYConversion(raw_destination_y);
            const isDestinationInBounds = (dbx >= 0 && dbx <= 7) && (dby >= 0 && dby <= 7);

            result.result = isDestinationInBounds;
            result.message = (!isDestinationInBounds) ? `Destination [${raw_coordinate_x}][${raw_coordinate_y}] is out of bounds!` : "";

            return result;
        }

        const canPieceMoveResult = (raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, chessboard) => {
            const result = {result: false, message: ""};
            const realChessboard = (chessboard) ? chessboard : this.chessboard;
            const cbx = Piece.coordinateXConversion(raw_coordinate_x);
            const cby = Piece.coordinateYConversion(raw_coordinate_y);
            const dbx = Piece.coordinateXConversion(raw_destination_x);
            const dby = Piece.coordinateYConversion(raw_destination_y);
            /** @type {Piece} */
            const selectedPiece = realChessboard[cbx][cby];

            return selectedPiece.isValidMovement(dbx, dby, realChessboard);
        }

        const isFactionKingCheckedOrMated = (currentPlayerFaction, chessboard) => {
            const result = {check: false, checkmate: false, message: ""};
            const realChessboard = (chessboard) ? chessboard : this.chessboard;
            /** @type {King} */
            const king = this.kings[currentPlayerFaction];
            const kingCheckResult = king.isKingCheckedOrMated(realChessboard);

            return kingCheckResult;
        }

        const willNextMoveCheckCurrentPlayer = (currentPlayerFaction, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, chessboard) => {
            const result = {result: false, message: ""};
            const cbx = Piece.coordinateXConversion(raw_coordinate_x);
            const cby = Piece.coordinateYConversion(raw_coordinate_y);
            const dbx = Piece.coordinateXConversion(raw_destination_x);
            const dby = Piece.coordinateYConversion(raw_destination_y);
            const duplChessboard = getDuplicateChessboard(chessboard);
            /** @type {Piece} */
            const selectedPiece = chessboard[cbx][cby];
            duplChessboard[cbx][cby] = undefined;
            duplChessboard[dbx][dby] = selectedPiece;
            selectedPiece.raw_coordinate_x = raw_destination_x;
            selectedPiece.raw_coordinate_y = raw_destination_y;

            /** @type {King} */
            const king = this.kings[currentPlayerFaction];
            const kingCheckResult = king.isKingCheckedOrMated(duplChessboard);

            // Reset the internal king values.
            selectedPiece.raw_coordinate_x = raw_coordinate_x;
            selectedPiece.raw_coordinate_y = raw_coordinate_y;

            result.result = (kingCheckResult.check || kingCheckResult.checkmate);
            result.message = (result.result) ? `Cannot move piece due to resulting ${this.turn} King check!` : "";

            return result;
        }

        const doesPawnNeedUpgradeCheck = (raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, chessboard, pawnUpgradeName) => {
            const result = {result: false, message: ""};
            const realChessboard = (chessboard) ? chessboard : this.chessboard;
            const cbx = Piece.coordinateXConversion(raw_coordinate_x);
            const cby = Piece.coordinateYConversion(raw_coordinate_y);
            /** @type {Piece} */
            const selectedPiece = realChessboard[cbx][cby];

            // To Handle pawn reaching the final row.
            const isPawnUpgradable = (selectedPiece.name == 'pawn' && selectedPiece.faction == 'white' && selectedPiece.raw_coordinate_y == '7' && raw_destination_y == '8')
                                        || (selectedPiece.name == 'pawn' && selectedPiece.faction == 'black' && selectedPiece.raw_coordinate_y == '2' && raw_destination_y == '1');

            const isPawnUpgradeGiven = (pawnUpgradeName);

            if (isPawnUpgradable && !isPawnUpgradeGiven) {
                result.result = true;
                result.message = "Choose pawn upgrade!";
                result.isUpgradingPawn = true;
            }

            return result;
        }

        const isMovingPieceAPawn = (raw_coordinate_x, raw_coordinate_y, chessboard) => {
            let result = false;
            const realChessboard = (chessboard) ? chessboard : this.chessboard;
            const cbx = Piece.coordinateXConversion(raw_coordinate_x);
            const cby = Piece.coordinateYConversion(raw_coordinate_y);
            /** @type {Piece} */
            const selectedPiece = realChessboard[cbx][cby];

            result = (selectedPiece.name == 'pawn');

            return result;
        }

        const doesPawnNeedUpgrade = (raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, chessboard) => {
            let result = false;
            const realChessboard = (chessboard) ? chessboard : this.chessboard;
            const cbx = Piece.coordinateXConversion(raw_coordinate_x);
            const cby = Piece.coordinateYConversion(raw_coordinate_y);
            /** @type {Piece} */
            const selectedPiece = realChessboard[cbx][cby];
            // To Handle pawn reaching the final row.
            const isPawnUpgradable = (selectedPiece.name == 'pawn' && selectedPiece.faction == 'white' && selectedPiece.raw_coordinate_y == '7' && raw_destination_y == '8')
                                        || (selectedPiece.name == 'pawn' && selectedPiece.faction == 'black' && selectedPiece.raw_coordinate_y == '2' && raw_destination_y == '1');

            
            result = isPawnUpgradable;

            return result;
        }

        const setUpgradePawnServerSide = (gameId, movingPlayerId, raw_coordinate_x, raw_coordinate_y, chessboard, pawnUpgradeName) => {
            const result = false;
            const realChessboard = (chessboard) ? chessboard : this.chessboard;
            const cbx = Piece.coordinateXConversion(raw_coordinate_x);
            const cby = Piece.coordinateYConversion(raw_coordinate_y);
            const curPlayerFaction = this.getPlayerFactionByID(movingPlayerId);
            /** @type {Piece} */
            const selectedPiece = realChessboard[cbx][cby];

            //gamesDB.upgradePawn(gameId, movingPlayerId, selectedPiece.pieceId, raw_coordinate_x, raw_coordinate_y, pawnUpgradeName, curPlayerFaction, (upgradedPieceRecord) => {
                //const upgradedPiece = this.createGamePieceInitByDBRecord(upgradedPieceRecord);
            //});

            //the fix is to manually convert the piece to whatever desired..
            const gamePieceRecord = selectedPiece.getGamePieceRecord();
            gamePieceRecord.name = pawnUpgradeName;
            const upgradedSelectedPiece = this.createGamePieceInitByDBRecord(gamePieceRecord);

            realChessboard[cbx][cby] = upgradedSelectedPiece;

            return;
        }

        const getMoveSelectedPieceTo = (gameId, movingPieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, chessboard, optionalData) => {
            const cbx = Piece.coordinateXConversion(raw_coordinate_x);
            const cby = Piece.coordinateYConversion(raw_coordinate_y);
            const dbx = Piece.coordinateXConversion(raw_destination_x);
            const dby = Piece.coordinateYConversion(raw_destination_y);
            /** @type {Piece} */
            const selectedPiece = chessboard[cbx][cby];
            /** @type {Piece|undefined} */
            const destinationPiece = chessboard[dbx][dby];

            chessboard[cbx][cby] = undefined;
            chessboard[dbx][dby] = selectedPiece;

            selectedPiece.raw_coordinate_x = raw_destination_x;
            selectedPiece.raw_coordinate_y = raw_destination_y;

            if (destinationPiece) {
                destinationPiece.alive = false;
                destinationPiece.raw_coordinate_x = null;
                destinationPiece.raw_coordinate_y = null;
            }

            //gamesDB.setGamePieceCoordinates(gameId, movingPieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, () => {});

            return selectedPiece;
        }

        const getUpdateTurn = (gameId, currentTurn) => {
            const nextTurn = (currentTurn == 'white') ? 'black' : 'white';
            gamesDB.updateTurn(gameId, nextTurn, () => {});

            return nextTurn;
        }

        /**
         * Get a duplicate of the given chessboard.
         * @param {Array[]} originalChessBoard The original chessboard containing references to all active Pieces.
         * @return {Array[]} A duplicate chessboard based on the given board.
         */
        const getDuplicateChessboard = (originalChessBoard = []) => {
           let tempChessBoard = [];
   
           for (let i = 0; i < originalChessBoard.length; i++) {
               tempChessBoard[i] = [];
               for (let j = 0; j < originalChessBoard[i].length; j++) {
                   tempChessBoard[i][j] = originalChessBoard[i][j];
               }
           }
   
           return tempChessBoard;
        }

        const finalizeMovement = (gameId, pieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, chessboard) => {
            const selectedPiece = getMoveSelectedPieceTo(gameId, pieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, chessboard);
            const nextTurn = getUpdateTurn(gameId, this.turn);
            const isEnemyKingCheckmated = isFactionKingCheckedOrMated(nextTurn);

            this.turn = nextTurn;

            const result = {};
            result.result = true;
            result.message = `Successful move from [${raw_coordinate_x}][${raw_coordinate_y}] to [${raw_destination_x}][${raw_destination_y}]!`;

            if (isEnemyKingCheckmated.checkmate) {
                this.active = false;
                this.setGameActiveState(false, () => {});
                result.message += ` ${this.turn} CHECKMATED! GAME OVER!`;
            }

            return result;
        }


        let result = isGameOver(this.active);
        if (!result.result) {
            result = isMovingPlayerTurn(movingPlayerId);
            if (result.result) {
                result = isMovingPieceSelectable(movingPlayerId, raw_coordinate_x, raw_coordinate_y);
                if (result.result) {
                    result = isDestinationInBounds(raw_destination_x, raw_destination_y);
                    if (result.result) {
                        result = canPieceMoveResult(raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y);
                        if (result.result) {
                            result = willNextMoveCheckCurrentPlayer(this.turn, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y,  this.chessboard);
                            if (!result.result) {
                                //result = doesPawnNeedUpgradeCheck(raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, this.chessboard, optionalData.pawnUpgradeName);
                                if (isMovingPieceAPawn(raw_coordinate_x, raw_coordinate_y)) {
                                    if (doesPawnNeedUpgrade(raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, this.chessboard)) {
                                        if (optionalData.pawnUpgradeName) {
                                            setUpgradePawnServerSide(this.gameId, movingPlayerId, raw_coordinate_x, raw_coordinate_y, this.chessboard, optionalData.pawnUpgradeName);
                                            gamesDB.setGamePieceUpgradeAndCoordinates(this.gameId, movingPlayerId, pieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, optionalData.pawnUpgradeName, this.getPlayerFactionByID(movingPlayerId), () => {});
                                            result = finalizeMovement(this.gameId, pieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, this.chessboard);

                                        } else {
                                            result.result = false;
                                            result.message = "Choose pawn upgrade!";
                                            result.isUpgradingPawn = true;
                                        }
                                    } else {
                                        result = finalizeMovement(this.gameId, pieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, this.chessboard);
                                        gamesDB.setGamePieceCoordinates(this.gameId, pieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, () => {});
                                    }
                                } else {
                                    result = finalizeMovement(this.gameId, pieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, this.chessboard);
                                    gamesDB.setGamePieceCoordinates(this.gameId, pieceId, raw_coordinate_x, raw_coordinate_y, raw_destination_x, raw_destination_y, () => {});
                                }
                            }
                        }
                    }
                }
            }
        }

        return result;
    }

}

module.exports = Game;