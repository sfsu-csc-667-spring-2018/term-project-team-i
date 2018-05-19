const Piece = require('../chess_pieces/piece.js');

class Pawn extends Piece {

    constructor (gamePieceRecord) {
        super(gamePieceRecord);

        this.name_white = 'white';
        this.name_black = 'black';
    }

    get isInitialMove() {
        let isInitialMove = false;

        if (this.faction === this.name_white) {
            isInitialMove = (this.raw_coordinate_y === '2');
        } else if (this.faction === this.name_black) {
            isInitialMove = (this.raw_coordinate_y === '7');
        }

        return isInitialMove;
    }

    /**
     * Determines if the given destination coordinates are allowed to be moved
     * into by this piece's movement rules.
     * @param {Number} idx_destination_x The destination x coordinates to move to in NUMBER form (0-7).
     * @param {Number} idx_destination_y The destination y coordinates to move to in NUMBER form (0-7).
     * @param {Number} directionContraint The direction of which this piece can only move.
     * @param {Array} chessboard The other active game pieces on the board to check for collisions.
     * @param {Object} otherConditions Optional parameters for potential fringe cases.
     * @returns {boolean} A boolean result indicate if the movement was valid.
     */
    __isValidMovement(idx_destination_x, idx_destination_y, directionContraint, chessboard = [], otherConditions) {
        
        /**
         * This helper function is used to determine if the given position has an enemy
         * or any piece. In context of the pawn, moving diagonally by {1,1} space requires
         * an enemy piece to be there to be valid for capture/movement. However the default case,
         * such as moving foward, would deny movement if ANY piece existed at the cell.
         */
        const funcNoPiecePresenceCheck = (colInc, rowInc, chessboard, allowedIfEnemy) => {
            const at_x = this.coordinateXConverted + colInc;
            const at_y = this.coordinateYConverted + rowInc;
            
            if (chessboard[at_x]) {
                /** @type {Piece} */
                const possiblePiece = chessboard[at_x][at_y];

                if (allowedIfEnemy) {
                    return (possiblePiece && possiblePiece.faction != this.faction);
                } else {
                    return (!possiblePiece);
                }
            } else {
                return true;
            }
        }

        const isDestinationDiagRight = ( (idx_destination_x == (this.coordinateXConverted + 1)) && (idx_destination_y == (this.coordinateYConverted + 1*(directionContraint))) );
        const theresEnemyDiagRight = funcNoPiecePresenceCheck(1, 1*directionContraint, chessboard, true);
        const isDestinationDiagLeft = ( (idx_destination_x == (this.coordinateXConverted - 1)) && (idx_destination_y == (this.coordinateYConverted + 1*(directionContraint))) );
        const theresEnemyDiagLeft = funcNoPiecePresenceCheck(-1, 1*directionContraint, chessboard, true);
        const isDestinationForwardOne = ( (idx_destination_x == (this.coordinateXConverted - 0)) && (idx_destination_y == (this.coordinateYConverted + 1*(directionContraint))) );
        const theresNoPieceAtForwardOne = funcNoPiecePresenceCheck(0, 1*directionContraint, chessboard, false);
        const isDestinationForwardTwo = ( (idx_destination_x == (this.coordinateXConverted - 0)) && (idx_destination_y == (this.coordinateYConverted + 2*(directionContraint))) );
        const theresNoPieceAtForwardTwo = (this.isInitialMove) ? funcNoPiecePresenceCheck(0, 2*directionContraint, chessboard, false) : false;

        // Now this is refined autism.
        return ((isDestinationDiagRight && theresEnemyDiagRight) 
                    || (isDestinationDiagLeft && theresEnemyDiagLeft) 
                        || (isDestinationForwardOne && theresNoPieceAtForwardOne) 
                            || (this.isInitialMove && isDestinationForwardTwo && theresNoPieceAtForwardOne && theresNoPieceAtForwardTwo)) ;
    }

    /**
     * Determines if the given destinations are valid positions the piece can move to.
     * The Pieces will also determine if there are blocking pieces in its path that prevents
     * it from moving the destination.
     * @param {Number} idx_destination_x The x coordinate destination in NUMBER form (0 to 7).
     * @param {Number} idx_destination_y The y coordinate destination in NUMBER form (0 to 7).
     * @param {Array} chessboard The array containing all the active game pieces currently on the chessboard.
     * @param {Object} otherConditions Optional conditions for special pieces just in case.
     */
    isValidMovement(idx_destination_x, idx_destination_y, chessboard = [], otherConditions) {

        if (isNaN(idx_destination_x) || isNaN(idx_destination_y)) {
            throw new Error(this.name + ": expecting destination x and y coordinates in Number form.");
        }

        let result = false;

        if (this.faction === this.name_white) {
            result = this.__isValidMovement(idx_destination_x, idx_destination_y, 1, chessboard);
        } else if (this.faction === this.name_black) {
            result = this.__isValidMovement(idx_destination_x, idx_destination_y, -1, chessboard);
        }
 
        return result;
    }
    
}

module.exports = Pawn;