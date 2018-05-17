const Piece = require('../chess_pieces/piece.js');

class Pawn extends Piece {

    constructor (gamePieceRecord) {
        super(gamePieceRecord);

        this.faction_white = 'white';
        this.faction_black = 'black';
        this.isInitialMove = this.__isInitialMove();
    }

    __isInitialMove() {
        let isInitialMove = false;

        if (this.faction === 'white') {
            isInitialMove = (this.coordinate_y === '2');
        } else if (this.faction === 'black') {
            isInitialMove = (this.coordinate_y === '7');
        }

        return isInitialMove;
    }

    /**
     * Determines if the given destination coordinates are allowed to be moved
     * into by this piece's movement rules.
     * @param {String} destination_x The destination x coordinates to move to.
     * @param {String} destination_y The destination y coordinates to move to.
     * @param {Number} directionContraint The direction of which this piece can only move.
     * @param {Array} chessboard The other active game pieces on the board to check for collisions.
     * @param {Object} otherConditions Optional parameters for potential fringe cases.
     * @returns {boolean} A boolean result indicate if the movement was valid.
     */
    __isValidMovement(destination_x, destination_y, directionContraint, chessboard = [], otherConditions) {
        
        /**
         * This helper function is used to determine if the given position has an enemy
         * or any piece. In context of the pawn, moving diagonally by {1,1} space requires
         * an enemy piece to be there to be valid for capture/movement. However the default case,
         * such as moving foward, would deny movement if ANY piece existed at the cell.
         */
        const funcNoPiecePresenceCheck = (colInc, rowInc, chessboard, allowedIfEnemy) => {
            const at_x = this.coordinate_x_number + colInc;
            const at_y = this.coordinate_y_number + rowInc;
            /** @type {Piece} */
            const possiblePiece = chessboard[at_x][at_y];

            if (allowedIfEnemy) {
                return (possiblePiece && possiblePiece.faction != this.faction);
            } else {
                return (!possiblePiece);
            }
        }

        const isDestinationDiagRight = ( (destination_x == (this.coordinate_x_number + 1)) && (destination_y == (this.coordinate_y_number + 1*(directionContraint))) );
        const theresEnemyDiagRight = funcNoPiecePresenceCheck(1, 1*directionContraint, chessboard, true);
        const isDestinationDiagLeft = ( (destination_x == (this.coordinate_x_number - 1)) && (destination_y == (this.coordinate_y_number + 1*(directionContraint))) );
        const theresEnemyDiagLeft = funcNoPiecePresenceCheck(-1, 1*directionContraint, chessboard, true);
        const isDestinationForwardOne = ( (destination_x == (this.coordinate_x_number - 0)) && (destination_y == (this.coordinate_y_number + 1*(directionContraint))) );
        const theresNoPieceAtForwardOne = funcNoPiecePresenceCheck(0, 1*directionContraint, chessboard, false);
        const isDestinationForwardTwo = ( (destination_x == (this.coordinate_x_number - 0)) && (destination_y == (this.coordinate_y_number + 2*(directionContraint))) );
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
     * @param {Number} destination_x The x coordinate destination in NUMBER form (0 to 7).
     * @param {Number} destination_y The y coordinate destination in NUMBER form (0 to 7).
     * @param {Array} chessboard The array containing all the active game pieces currently on the chessboard.
     * @param {Object} otherConditions Optional conditions for special pieces just in case.
     */
    isValidMovement(destination_x, destination_y, chessboard = [], otherConditions) {

        if (isNaN(destination_x) || isNaN(destination_y)) {
            throw new Error(this.name + ": expecting destination x and y coordinates in Number form.");
        }

        const result = false;

        if (this.faction === this.faction_white) {
            result = this.__isValidMovement(destination_x, destination_y, 1, conditions);
        } else if (this.faction === this.faction_black) {
            result = this.__isValidMovement(destination_x, destination_y, -1, conditions);
        }
 
        return result;
    }
    
}

module.exports = Pawn;