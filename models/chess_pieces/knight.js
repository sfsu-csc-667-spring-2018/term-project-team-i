const Piece = require('../chess_pieces/piece.js');

class Knight extends Piece{

    isValidMovement(idx_destination_x, idx_destination_y, chessboard = [], otherConditions){
        const result = {result: false, message: ""};
        
        let startX = Piece.coordinateXConversion(this.raw_coordinate_x);
        let startY = Piece.coordinateYConversion(this.raw_coordinate_y);

        let X =  idx_destination_x - startX;
        let Y = idx_destination_y - startY;

        if (Y < -2 || Y > 2) {
            result.result = false;
        }else if (X < -2 || X > 2) {
            result.result = false; //range check
            result.message = `Invalid move to {${idx_destination_x}, ${idx_destination_y}}!`;
        }else if (Y === X + 3) {
            result.result = true;
        } else if (Y === X - 3) {
            result.result = true;
        } else if (Y === -X + 3) {
            result.result = true;
        }else if (Y === -X - 3) {
            result.result = true;
        }

        return result;
    }
}

module.exports = Knight;
