const Piece = require('../chess_pieces/piece.js');

class Bishop extends Piece{

    isValidMovement(idx_destination_x, idx_destination_y, chessboard = [], otherConditions) {
        const xDestDiff = Math.abs(idx_destination_x - this.coordinateXConverted);
        const yDestDiff = Math.abs(idx_destination_y - this.coordinateYConverted);
        const isMovingDiagonally = (xDestDiff == yDestDiff);

        return this.__movementLinearHandler(isMovingDiagonally, idx_destination_x, idx_destination_y, chessboard);
    }
    
}

module.exports = Bishop;