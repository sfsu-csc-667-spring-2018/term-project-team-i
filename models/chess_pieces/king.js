const Piece = require('../chess_pieces/piece');

class King extends Piece{

    /***TODO
     * kingCheck check
     */
    moveKing(newCoordinateX, newCoordinateY, chessboard = []){
        let startX = this.coordinateXConversion(this.coordinate_x);
        let startY = this.coordinateYConversion(this.coordinate_y);

        let X =  this.coordinateXConversion(newCoordinateX) - startX;
        let Y = this.coordinateYConversion(newCoordinateY) - startY;

        if (Y < -1 || Y > 1) return false;
        else if (X < -1 || X > 1) return false; //one square check

        else if (Y === 0) return true;
        else if (X === 0) return true;
        else if (Y === X) return true;
        else if (Y === -X) return true;
        return false
    }

    isKingInCheck(kingX, kingY, chessboard = []){

    }
}

module.exports = King;