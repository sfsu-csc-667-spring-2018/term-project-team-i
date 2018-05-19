const Piece = require('../chess_pieces/piece.js');

class Queen extends Piece{


    isValidMovement(idx_destination_x, idx_destination_y, chessboard = [], otherConditions) {
        const result = {result: false, message: ""};
        const xDestDiff = Math.abs(idx_destination_x - this.coordinateXConverted);
        const yDestDiff = Math.abs(idx_destination_y - this.coordinateYConverted);
        const isMovingHorizontal = (this.coordinateXConverted == idx_destination_x);
        const isMovingVertically = (this.coordinateYConverted == idx_destination_y);
        const isMovingDiagonally = (xDestDiff == yDestDiff);
        const isMovingLegitimately = (isMovingDiagonally)
                                        ||(isMovingHorizontal && !isMovingVertically) 
                                            || (!isMovingHorizontal && isMovingVertically);

        if (isMovingLegitimately) {
            const coordinate_x_inc = Math.sign(idx_destination_x - this.coordinateXConverted);
            const coordinate_y_inc = Math.sign(idx_destination_y - this.coordinateYConverted);

            const hitPiece = Piece.getFirstPieceScan(this.coordinateXConverted, 
                                                        this.coordinateYConverted,
                                                                    coordinate_x_inc,
                                                                        coordinate_y_inc,
                                                                                chessboard);

                
            if (hitPiece) {
                const isMovementBlocked = Piece.isOtherPieceBlocking(this, hitPiece, idx_destination_x, idx_destination_y);
                const isHitPieceAtDestination = (hitPiece.coordinateXConverted == idx_destination_x) 
                                                    && (hitPiece.coordinateYConverted == idx_destination_y);
                const isHitPieceAlly = (this.faction == hitPiece.faction);

                if (isMovementBlocked) {
                    result.result = false;
                    result.message = `Movement to {${idx_destination_x}, ${idx_destination_y}} is blocked!`;
                    
                } else if (!isMovementBlocked && isHitPieceAtDestination && isHitPieceAlly) {
                    result.result = false;
                    result.message = `Cannot capture pieces of the same faction!`;
                } else {
                    result.result = true;
                    result.message = "";
                }
            } else {
                result.result = true;
                result.message = "";
            }
        } else {
            result.result = false;
            result.message = `Invalid move to {${idx_destination_x}, ${idx_destination_y}}!`;
        }

        return result.result;
    }

    moveQueen(newCoordinateX, newCoordinateY, allGamePieces = []){
        let startX = this.coordinateXConversion(this.coordinate_x);
        let startY = this.coordinateYConversion(this.coordinate_y);

        let X =  this.coordinateXConversion(newCoordinateX) - startX;
        let Y = this.coordinateYConversion(newCoordinateY) - startY;

        /**** TODO
         * iterate through allGamePieces to see if another
         * piece is between start and end
         */
        if (Y === 0) return true;
        else if (X === 0) return true;
        else if (Y === X) return true;
        else if (Y === -X) return true;
        return false;
    }
}

module.exports = Queen;