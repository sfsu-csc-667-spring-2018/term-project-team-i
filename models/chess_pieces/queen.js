const Piece = require('../chess_pieces/piece.js');

class Queen extends Piece{

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