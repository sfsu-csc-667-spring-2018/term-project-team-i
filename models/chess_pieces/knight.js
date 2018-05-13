const Piece = require('../chess_pieces/piece.js');

class Knight extends Piece{

    moveKnight(newCoordinateX, newCoordinateY, allGamePieces = []){
        let startX = this.coordinateXConversion(this.coordinate_x);
        let startY = this.coordinateYConversion(this.coordinate_y);

        let X =  this.coordinateXConversion(newCoordinateX) - startX;
        let Y = this.coordinateYConversion(newCoordinateY) - startY;

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
