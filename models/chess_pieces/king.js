const Piece = require('../chess_pieces/piece');

class King extends Piece{

    /**
     * @private
     * @return {Piece[]} An array of Pieces that the King has a clear line of sight on.
     */
    __getAllAttackingPieces(origin_x, origin_y, chessboard) {
        const hitPieces = []

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
     *
     * @param {Piece[]}
     * @param {Array[]}
     * @private
     * @return {Piece} Returns Piece or undefined if nothing is checking the king.
     */
    __getCheckingPiece(origin_x, origin_y, hitPieces = [], chessboard = []) {
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
     *
     * @param chessboard
     * @return {Object[]<x: Number, y: Number>}
     * @private
     */
    __getFreePositions(chessboard) {
        const freePositions = [];

        // Check every position for an open space to move to.
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                const canKingMoveTo = this.isValidMovement(this.coordinateXConverted + x, this.coordinateYConverted + y, chessboard);
                if (canKingMoveTo) {
                    freePositions.push({x: x, y: y});
                }
            }
        }

        return freePositions;
    }

    /**
     *
     * @param chessboard
     * @param chessboardSize
     * @return {Piece[]}
     * @private
     */
    __getAllies(chessboard = [], chessboardSize = 8) {
        const allies = [];

        for (let x = 0; x < chessboardSize; x++) {
            for (let y = 0; y < chessboardSize; y++) {
                if (chessboard[x]) {
                    /** @type {Piece} */
                    const possibleAlly = chessboard[x][y];

                    if (possibleAlly.faction == this.faction) {
                        allies.push(possibleAlly);
                    }
                }
            }
        }

        return allies;
    }

    __getTempChessBoard(originalChessBoard = []) {
        let tempChessBoard = [];

        for (let i = 0; i < originalChessBoard.length; i++) {
            tempChessBoard[i] = [];
            for (let j = 0; j < originalChessBoard[i].length; j++) {
                tempChessBoard[i][j] = originalChessBoard[i][j];
            }
        }

        return tempChessBoard;
    }

    __getSafePositionToMoveTo(freePositions, chessboard) {
        let hasSafePosition = undefined;

        // 4. Check which free positions aren't checking the king.
        for (let i = 0; i < freePositions.length; i++) {
            const x = freePositions[i].x;
            const y = freePositions[i].y;

            const tempHitPieces = this.__getAllAttackingPieces(this.coordinateXConverted + x, this.coordinateYConverted + y, chessboard);
            const tempCheckingPiece = this.__getCheckingPiece(this.coordinateXConverted + x, this.coordinateYConverted + y, tempHitPieces, chessboard);

            if (!tempCheckingPiece) {
                hasSafePosition = {x: x, y: y};
                break;
            }
        }

        return hasSafePosition;
    }

    /***TODO
     * kingCheck check
     */
    isValidMovement(idx_destination_x, idx_destination_y, chessboard = [], otherConditions){
        let startX = Piece.coordinateXConversion(this.raw_coordinate_x);
        let startY = Piece.coordinateYConversion(this.raw_coordinate_y);

        let X =  idx_destination_x - startX;
        let Y = idx_destination_y - startY;

        if (Y < -1 || Y > 1) return false;
        else if (X < -1 || X > 1) return false; //one square check

        else if (Y === 0) return true;
        else if (X === 0) return true;
        else if (Y === X) return true;
        else if (Y === -X) return true;
        return false
    }

    isKingInCheck(chessboard = []){

        /*
            1. Check 360 degrees for hitpieces via getFirstPieceScan().
            2. Determine if any are checking this king.
            3. Determine free positions the king can move to.
            4. Check free positions 1 at a time and repeat steps 1-2.
                4a. If Still checked, break; go back to original positions.
                4b. If not checked, then new position is valid and this is not checkmate;
                        (Let the user figure out the rest). break out of these loops via return(??)
            5. Assumed is still checked in all free positions, check against the Checking Piece if
                    there's anything that (of the king's faction) can kill it, or block it.
                    5.a Loop the distance from king to checking Piece.
                        5.a.a Loop king's alive pieces if they have isValidMovement() against that position.
                    If this loop returns false entirely then the king is checkmated.
         */

        let result = {check: false, checkmate: false};
        // 1. Get all attacking pieces against the king.
        const hitPieces = this.__getAllAttackingPieces(this.coordinateXConverted, this.coordinateYConverted, chessboard);
        // 2. Determine if they are checking the king; there can only be one checking piece at a time.
        const checkingPiece = this.__getCheckingPiece(this.coordinateXConverted, this.coordinateYConverted, hitPieces, chessboard);

        if (checkingPiece) {
            // 3. If King is checked then get free positions around King.
            const freePositions = this.__getFreePositions(chessboard);
            const hasSafePositionToMoveTo = this.__getSafePositionToMoveTo(freePositions, chessboard);

            // 5. NO safe positions for the King to escape to; Check if anyone else can kill the checking piece.
            if (!hasSafePositionToMoveTo) {

                const hasPieceAllyToInterfere = this.__getAllyMoveDestination(pieceAlly, target_x, target_y)

                const allies = this.__getAllies(chessboard);

                const canAllyKillPiece = (pieceAlly, checkingPiece) => {
                    let canKill = false;

                    if (pieceAlly.isValidMovement(checkingPiece.coordinateXConverted, checkingPiece.coordinateYConverted, chessboard)) {
                        // Use temp chessboard to move ally piece.
                        // Use temp chessboard to see if King is still in check.
                        const tempChessBoard = this.__getTempChessBoard(chessboard);
                        tempChessBoard[checkingPiece.coordinateXConverted][checkingPiece.coordinateYConverted] = pieceAlly;

                        const tempHitPieces = this.__getAllAttackingPieces(this.coordinateXConverted, this.coordinateYConverted, tempChessBoard);
                        const tempCheckingPiece = this.__getCheckingPiece(this.coordinateXConverted, this.coordinateYConverted, tempHitPieces, tempChessBoard);

                        if (!tempCheckingPiece) {
                            return result;
                        }
                    }
                };

                for (let i = 0; i < allies.length; i++) {
                    const pieceAlly = allies[i];

                    // 6. Check if ally can kill enemy piece.
                    if (checkingPiece.name == 'knight') {
                        if (pieceAlly.isValidMovement(checkingPiece.coordinateXConverted, checkingPiece.coordinateYConverted, chessboard)) {
                            // Use temp chessboard to move ally piece.
                            // Use temp chessboard to see if King is still in check.
                            const tempChessBoard = this.__getTempChessBoard(chessboard);
                            tempChessBoard[checkingPiece.coordinateXConverted][checkingPiece.coordinateYConverted] = pieceAlly;

                            const tempHitPieces = this.__getAllAttackingPieces(this.coordinateXConverted, this.coordinateYConverted, tempChessBoard);
                            const tempCheckingPiece = this.__getCheckingPiece(this.coordinateXConverted, this.coordinateYConverted, tempHitPieces, tempChessBoard);

                            if (!tempCheckingPiece) {
                                return result;
                            }
                        }
                    } else {
                        if ()
                    }
                }
            }
        }

        return result;
    }
}

module.exports = King;