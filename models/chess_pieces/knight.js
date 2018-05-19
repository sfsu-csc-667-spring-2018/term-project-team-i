const Piece = require('../chess_pieces/piece.js');

class Knight extends Piece{

    isValidMovement(idx_destination_x, idx_destination_y, chessboard = [], otherConditions){
        let startX = Piece.coordinateXConversion(this.raw_coordinate_x);
        let startY = Piece.coordinateYConversion(this.raw_coordinate_y);

        let X =  idx_destination_x - startX;
        let Y = idx_destination_y - startY;

        if (Y < -2 || Y > 2) return false;
        else if (X < -2 || X > 2) return false; //range check
        else if (Y === X + 3) return true;
        else if (Y === X - 3) return true;
        else if (Y === -X + 3) return true;
        else if (Y === -X - 3) return true;

        return false;
    }
}

module.exports = Knight;
