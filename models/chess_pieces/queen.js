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
}

module.exports = Queen;