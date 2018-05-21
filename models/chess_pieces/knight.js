const Piece = require('../chess_pieces/piece.js');

class Knight extends Piece{

    isValidMovement(idx_destination_x, idx_destination_y, chessboard = [], otherConditions){

        let isMoveLegitimate = false;
        const result = {result: false, message: ""};
        const offsets = [[2,1], [2,-1], [1,2], [1,-2], [-1,-2], [-1,2], [-2,-1], [-2,1]];

        for (let i = 0; i < offsets.length; i++) {
            const offsetx = offsets[i][0];
            const offsety = offsets[i][1];
            const isExactlyDestinationX = (idx_destination_x == this.coordinateXConverted + offsetx);
            const isExactlyDestinationY = (idx_destination_y == this.coordinateYConverted + offsety);

            if (isExactlyDestinationX && isExactlyDestinationY) {
                isMoveLegitimate = true;
                break;
            }
        }

        if (!isMoveLegitimate) {
            result.result = false;
            result.message = `Invalid movement pattern to [${Piece.coordinateXAsRaw(idx_destination_x)}][${Piece.coordinateYAsRaw(idx_destination_y)}]`;
        } else {
            /** @type {Piece} */
            const possibleAlly = chessboard[idx_destination_x][idx_destination_y];

            if (possibleAlly && possibleAlly.faction == this.faction) {
                result.result = false;
                result.message = `Cannot capture pieces of the same faction!`;
            } else {
                result.result = true;
                result.message = `Successful move to {${Piece.coordinateXAsRaw(idx_destination_x)}, ${Piece.coordinateYAsRaw(idx_destination_y)}}`;
            }
        }

        return result;
    }
}

module.exports = Knight;
