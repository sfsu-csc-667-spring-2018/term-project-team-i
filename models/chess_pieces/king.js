const Piece = require('../chess_pieces/piece');


class King extends Piece{

    /**
     * Retrieves an array of all pieces in the line of sight from the given origin.
     * @param {Number} origin_x The origin x-coordinate to begin scanning from.
     * @param {Number} origin_y The origin y-coordinate to begin scanning from.
     * @param {Array[].Piece} chessboard The chessboard contain all Pieces.
     * @return {Piece[]} An array of Pieces that the King has a clear line of sight on.
     */
    __getPiecesInSightFrom(origin_x, origin_y, chessboard) {
        const hitPieces = []

        // Check for other pieces except the knights due to their unique movement.
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                const hitPiece = Piece.getFirstPieceScan(origin_x, origin_y, x, y, chessboard);
                hitPieces.push(hitPiece);
            }
        }

        // Check for knights
        for (let x = -2; x <= 2; x++) {
            if (x == 0) continue;
            for (let y = -2; y <= 2; y++) {
                if (y == 0 || y == x || y == -x) continue;
                /** @type {Piece}*/
                const hitPiece = Piece.getFirstPieceScan(origin_x, origin_y, x, y, chessboard);
                if (hitPiece && hitPiece.name == 'knight') {
                    hitPieces.push(hitPiece);
                }
            }
        }

        return hitPieces;
    }


    /**
     * Returns the Piece that is checking the King, if any.
     * @param {Number} origin_x The origin x-coordinate for the potential enemy to valid their movement against.
     * @param {Number} origin_y The origin y-coordinate for the potential enemy to valid their movement against.
     * @param {Piece[]} hitPieces The array of pieces that may be viable to attacking.
     * @param {Array[]} chessboard The chessboard contain all Pieces.
     * @return {Piece} The piece that is targeting the king, if any. If no Piece is viable then undefined is return.
     */
    __getPieceThatsCheckingKing(origin_x, origin_y, hitPieces = [], chessboard = []) {
        let checkingPiece = undefined;

        for (let idx = 0; idx < hitPieces.length; idx++) {
            const hitPiece = hitPieces[idx];
            const isHitPieceEnemy = (hitPiece) && (this.faction !== hitPiece.faction);
            const isHitPieceChecking = (hitPiece) && hitPiece.isValidMovement(origin_x, origin_y, chessboard);

            // King is checked.
            if (isHitPieceEnemy && isHitPieceChecking) {
                checkingPiece = hitPiece;
                break;
            }
        }

        return checkingPiece;
    }

    /**
     * Get chessboard positions of which this King may move to. Note that this
     * does not determine another check upon moving there.
     * @param {*} chessboard The chessboard contain all Pieces.
     * @return {Object[]} An array of objects containing the keys {x: number, y: number} representing viable coordinates to move to.
     */
    __getPositionsThatAreOpenToKing(chessboard) {
        const freePositions = [];

        // Check every position for an open space to move to.
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                const canKingMoveTo = this.isValidMovement(this.coordinateXConverted + x, 
                                                                this.coordinateYConverted + y, chessboard);
                if (canKingMoveTo) {
                    freePositions.push({x: x, y: y});
                }
            }
        }

        return freePositions;
    }

    /**
     * Get the allied Pieces of the King.
     * @param {Array[]} chessboard The chessboard containing all Pieces.
     * @param {Number} chessboardSize Optional size of the chessboard. Default size is 8.
     * @return {Piece[]} All allies of that King that are still alive on the chessboard.
     */
    __getAlliesOfKing(chessboard = [], chessboardSize = 8) {
        const allies = [];

        for (let x = 0; x < chessboardSize; x++) {
            for (let y = 0; y < chessboardSize; y++) {
                if (chessboard[x]) {
                    /** @type {Piece} */
                    const possibleAlly = chessboard[x][y];

                    if (possibleAlly && possibleAlly.faction == this.faction && possibleAlly.name != this.name) {
                        allies.push(possibleAlly);
                    }
                }
            }
        }

        return allies;
    }

    /**
     * Get a duplicate of the given chessboard.
     * @param {Array[]} originalChessBoard The original chessboard containing references to all active Pieces.
     * @return {Array[]} A duplicate chessboard based on the given board.
     */
    __getDuplicateChessboard(originalChessBoard = []) {
        let tempChessBoard = [];

        for (let i = 0; i < originalChessBoard.length; i++) {
            tempChessBoard[i] = [];
            for (let j = 0; j < originalChessBoard[i].length; j++) {
                tempChessBoard[i][j] = originalChessBoard[i][j];
            }
        }

        return tempChessBoard;
    }

    /**
     * Retrieves positions of which the King may move to that won't result in another check.
     * @param {Object[]} freePositions An array of objects where the objects should be {x: number, y: number}.
     * @param {Array[]} chessboard The chessboard containing all the Pieces that are alive.
     * @return {{x: Number, y: Number}[]} An array of objects containing positions that the King can move to escape.
     */
    __getPositionsSafeForKing(freePositions, chessboard) {
        let safePositions = [];

        for (let i = 0; i < freePositions.length; i++) {
            const offsetx = freePositions[i].x;
            const offsety = freePositions[i].y;

            const tempChessBoard = this.__getDuplicateChessboard(chessboard);
            tempChessBoard[this.coordinateXConverted][this.coordinateYConverted] = undefined;
            tempChessBoard[this.coordinateXConverted+offsetx][this.coordinateYConverted+offsety] = this;

            const tempHitPieces = this.__getPiecesInSightFrom(this.coordinateXConverted + offsetx, this.coordinateYConverted + offsety, tempChessBoard);
            const tempCheckingPiece = this.__getPieceThatsCheckingKing(this.coordinateXConverted + offsetx, this.coordinateYConverted + offsety, tempHitPieces, tempChessBoard);

            if (!tempCheckingPiece) {
                safePositions.push(
                    [
                        Piece.coordinateXAsRaw(this.coordinateXConverted+offsetx), 
                        Piece.coordinateYAsRaw(this.coordinateYConverted+offsety)
                    ]
                );
            }
        }

        return safePositions;
    }

    /**
     * Try to find an ally Piece of this King that can either capture or block the path of
     * the opposing Piece that is in position to capture this King.
     * @param {Piece} kingCheckingPiece The Piece that is in position to capture this King.
     * @param {Array[]} chessboard The chessboard containing all Pieces that are alive.
     * @param {Number} chessboardSize Optional chessboard size
     * @return {Piece} A allied Piece of this King that can stop the opposing King checking Piece.
     */
    __getPieceThatCanSaveKingFrom(kingCheckingPiece, chessboard, chessboardSize = 8) {
        let kingSavingPiece = undefined;
        const kingAllyPieces = this.__getAlliesOfKing(chessboard);
        const kingCheck_x_dec = Math.sign(this.coordinateXConverted - kingCheckingPiece.coordinateXConverted);
        const kingCheck_y_dec = Math.sign(this.coordinateYConverted - kingCheckingPiece.coordinateYConverted);

        for (let target_x = kingCheckingPiece.coordinateXConverted, target_y = kingCheckingPiece.coordinateYConverted;
                                            !(target_x == this.coordinateXConverted && target_y == this.coordinateYConverted)
                                                && ((target_x >= 0 && target_x < chessboard.length) && (target_y >= 0 && target_y < chessboard.length));
                                                                                                    target_x += kingCheck_x_dec, target_y += kingCheck_y_dec) {

            //console.log(`CHECKING target positions {${target_x}, ${target_y}}`);                                                                                            
            for (let kdx = 0; kdx < kingAllyPieces.length; kdx++) {
                const kingAllyPiece = kingAllyPieces[kdx];

                if (kingAllyPiece.isValidMovement(target_x, target_y, chessboard)) {
                    const chessboardDuplicate = this.__getDuplicateChessboard(chessboard);
                    chessboardDuplicate[kingAllyPiece.coordinateXConverted][kingAllyPiece.coordinateYConverted] = undefined;                                                                        
                    chessboardDuplicate[target_x][target_y] = kingAllyPiece; 
                    
                    // King scans 360 again with this temporary chessboard of where this current Ally has attempted to intercept.
                    const newHitPieces = this.__getPiecesInSightFrom(this.coordinateXConverted, this.coordinateYConverted, chessboardDuplicate);
                    const newKingCheckingPiece = this.__getPieceThatsCheckingKing(this.coordinateXConverted, this.coordinateYConverted, newHitPieces, chessboardDuplicate);

                    if (!newKingCheckingPiece) {
                        kingSavingPiece = kingAllyPiece;
                        return kingSavingPiece;
                    }
                }
            }
        }

        return kingSavingPiece;
    }

   
    isValidMovement(idx_destination_x, idx_destination_y, chessboard = [], otherConditions){
        const result = {valid: false, message: ""};
        const xDestDiff = idx_destination_x - this.coordinateXConverted;
        const yDestDiff = idx_destination_y - this.coordinateYConverted;

        const magnitude = Math.sqrt(Math.pow(xDestDiff, 2) + Math.pow(yDestDiff, 2));
        const isMovingSingleSpace = (Math.floor(magnitude) == 1); 


        return this.__movementLinearHandler(isMovingSingleSpace, idx_destination_x, idx_destination_y, chessboard);
    }

    /**
     * Determines whether or not the is checked or checkmated.
     * @param {Array[]} chessboard The chessboard containing all the Pieces that are alive.
     * @return {{check: boolean, checkmate: boolean, message: string}} An object determining if the King
     * is checked or checkmated and a corresponding message indicating the status.
     */
    isKingCheckOrMated(chessboard = []){

        let result = {check: false, checkmate: false, message: ""};
        const hitPieces = this.__getPiecesInSightFrom(this.coordinateXConverted, this.coordinateYConverted, chessboard);
        const kingCheckingPiece = this.__getPieceThatsCheckingKing(this.coordinateXConverted, this.coordinateYConverted, hitPieces, chessboard);

        if (kingCheckingPiece) {
            // 3. If King is checked then get free positions around King.
            const kingAvailableMovementPositions = this.__getPositionsThatAreOpenToKing(chessboard);
            const kingCanMoveToASafePosition = this.__getPositionsSafeForKing(kingAvailableMovementPositions, chessboard);
            //console.log("KING CHECK: has a safe spot by translating to: " + JSON.stringify(kingCanMoveToASafePosition));

            if (kingCanMoveToASafePosition.length > 0) {
                result.check = true;
                result.checkmate = false;
                result.message = `${this.faction} King is CHECKED! You may move the King to one of these positions to escape: ${JSON.stringify(kingCanMoveToASafePosition)}`;
            } else {
                const kingSavingPiece = this.__getPieceThatCanSaveKingFrom(kingCheckingPiece, chessboard);

                if (kingSavingPiece) {
                    const kspName = kingSavingPiece.name;
                    const ksp_rawX = kingSavingPiece.raw_coordinate_x;
                    const ksp_rawY = kingSavingPiece.raw_coordinate_y;

                    result.check = true;
                    result.checkmate = false;
                    result.message = `${this.faction} King CHECKED! ${kspName} at {${ksp_rawX}, ${ksp_rawY}} can save the King!`;
                } else {
                    result.check = true;
                    result.checkmate = true;
                    result.message = `${this.faction} CHECKMATED! ${kingCheckingPiece.faction} WINS!`;
                }
            }
        }

        return result;
    }
}

module.exports = King;