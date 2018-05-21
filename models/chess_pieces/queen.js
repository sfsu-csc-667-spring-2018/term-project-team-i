const Piece = require('../chess_pieces/piece.js');

class Queen extends Piece{


    isValidMovement(idx_destination_x, idx_destination_y, chessboard = [], otherConditions) {
        const xDestDiff = Math.abs(idx_destination_x - this.coordinateXConverted);
        const yDestDiff = Math.abs(idx_destination_y - this.coordinateYConverted);
        const isMovingHorizontal = (this.coordinateXConverted == idx_destination_x);
        const isMovingVertically = (this.coordinateYConverted == idx_destination_y);
        const isMovingDiagonally = (xDestDiff == yDestDiff);
        const isMovingLegitimately = (isMovingDiagonally)
                                        ||(isMovingHorizontal && !isMovingVertically) 
                                            || (!isMovingHorizontal && isMovingVertically);

        return this.__movementLinearHandler(isMovingLegitimately, idx_destination_x, idx_destination_y, chessboard);
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