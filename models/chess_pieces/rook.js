const Piece = require('../chess_pieces/piece.js');

class Rook extends Piece{

    isValidMovement(idx_destination_x, idx_destination_y, chessboard = [], otherConditions) {
        const isMovingHorizontal = (this.coordinateXConverted == idx_destination_x);
        const isMovingVertically = (this.coordinateYConverted == idx_destination_y);
        const isMovingLegitimately = (isMovingHorizontal && !isMovingVertically) 
                                        || (!isMovingHorizontal && isMovingVertically);

        return this.__movementLinearHandler(isMovingLegitimately, idx_destination_x, idx_destination_y, chessboard);
    }
}

module.exports = Rook;