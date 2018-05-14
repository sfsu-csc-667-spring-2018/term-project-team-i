const Piece = require('../chess_pieces/piece.js');
class Rook extends Piece{

    moveRook(newCoordinateX, newCoordinateY, allGamePieces = []){
        let startX = this.coordinateXConversion(this.coordinate_x);
        let startY = this.coordinateYConversion(this.coordinate_y);

        let X =  this.coordinateXConversion(newCoordinateX) - startX;
        let Y = this.coordinateYConversion(newCoordinateY) - startY;

        /**** TODO
         * iterate through allGamePieces to see if another
         * piece is between start and end
         */

        //legit move
        if((Y === 0) || (X === 0)) {
            if (Y < 0) {
                for (let i = 1; i <= Math.abs(Y); i++) {
                    //traverse array for negative vertical direction, set X =0
                    if(allGamePieces[startX][startY - i] === undefined)
                        continue;
                    else if(allGamePieces[startX][startY - i] !== undefined)
                        return false;
                    else
                        return true
                }
            }
            else if (Y > 0) {
                for (let i = 1; i <= Y; i++) {
                    //traverse array for positive vertical direction
                    if(allGamePieces[startX][startY + i] === undefined)
                        continue;
                    else if(allGamePieces[startX][startY + i] !== undefined)
                        return false;
                    else
                        return true
                }
            }
            else if (X > 0) {
                for (let i = 1; i <= X; i++) {
                    //traverse array for positive horizontal direction
                    if(allGamePieces[startX + i][startY] === undefined)
                        continue;
                    else if(allGamePieces[startX + i][startY] !== undefined)
                        return false;
                    else
                        return true
                }
            }
            else if (X < 0) {
                for (let i = 1; i <= Math.abs(X); i++) {
                    //traverse array for negative horizontal direction
                    if(allGamePieces[startX - i][startY] === undefined)
                        continue;
                    else if(allGamePieces[startX - i][startY] !== undefined)
                        return false;
                    else
                        return true
                }
            }
            else
                return false;
        }
        return false;
    }
}

module.exports = Rook;