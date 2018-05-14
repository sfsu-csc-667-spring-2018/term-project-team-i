const Piece = require('../chess_pieces/piece.js');

class Bishop extends Piece{

    moveBishop(newCoordinateX, newCoordinateY, allGamePieces = []){
        let startX = this.coordinateXConversion(this.coordinate_x);
        let startY = this.coordinateYConversion(this.coordinate_y);

        let X =  this.coordinateXConversion(newCoordinateX) - startX;
        let Y = this.coordinateYConversion(newCoordinateY) - startY;

        /**** TODO
         * iterate through allGamePieces to see if another
         * piece is between start and end
         */
        if (Y === X) {
            if(Y > 0 && X > 0) {
                for (let i = 1; i <= Y; i++) {//quadrant 1
                    if (allGamePieces[startX + i][startY + i] === undefined)
                        continue;
                    else if(allGamePieces[startX + i][startY + i] !== undefined)
                        return false;
                    else
                        return true;
                    }
            }
            else if(Y < 0 && X < 0){
                for (let i = 1; i <= Math.abs(Y); i++) { //quadrant 3
                    if (allGamePieces[startX - i][startY - i] === undefined)
                        continue;
                    else if(allGamePieces[startX - i][startY - i] !== undefined)
                        return false;
                    else
                        return true;
                }
            }
        }

        else if (Y === -X)
            if(Y < 0 && X > 0){
                for (let i = 1; i <= Math.abs(Y); i++) { //quadrant 4
                    if (allGamePieces[startX + i][startY - i] === undefined)
                        continue;
                    else if(allGamePieces[startX + i][startY - i] !== undefined)
                        return false;
                    else
                        return true;
                }
            }
            else if(Y > 0 && X < 0){
                for (let i = 1; i <= Math.abs(Y); i++) { //quadrant 2
                    if (allGamePieces[startX - i][startY + i] === undefined)
                        continue;
                    else if(allGamePieces[startX - i][startY + i] !== undefined)
                        return false;
                    else
                        return true;
                }
        }

        return false;
    }
}

module.exports = Bishop;