const Piece = require('../chess_pieces/piece');

class King extends Piece{

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

    isKingInCheck(kingX, kingY, chessboard = []){

    }
}

module.exports = King;