const Piece = require('./piece.js');

class Pawn {

    constructor (gamePieceRecord) {
        super(gamePieceRecord);

        this.faction_white = 'white';
        this.faction_black = 'black';
        this.isInitialMove = this.__isInitialMove();
    }

    __isInitialMove() {
        const isInitialMove = false;

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
     * @param {String} newCoordinateX The destination x coordinates to move to.
     * @param {String} newCoordinateY The destination y coordinates to move to.
     * @param {Number} directionContraint The direction of which this piece can only move.
     * @param {Array} allGamePieces The other active game pieces on the board to check for collisions.
     * @param {Object} otherConditions Optional parameters for potential fringe cases.
     * @returns {boolean} A boolean result indicate if the movement was valid.
     */
    __isValidMovement(newCoordinateX, newCoordinateY, directionContraint, allGamePieces = [][], otherConditions) {
        const arr = [];
        
        const isValid = false;
        const xdiff = newCoordinateX - this.coordinate_x;
        const ydiff = newCoordinateY - this.coordinate_y;
        const yMaxMovement = (this.isInitialMove) ? 2 : 1;
        const isCorrectDirection = (Math.sign(ydiff) == Math.sign(directionContraint));
        const isMovingWithinLimit = (Math.abs(ydiff) <= yMaxMovement);

        // Check if pawn is moving in appropriate direction (in context of black or white faction)
        if (isCorrectDirection && isMovingWithinLimit) {
            // Check if piece exists
            const possi
        }

    }

    
    isValidMovement(newCoordinateX, newCoordinateY, allGamePieces = [], otherConditions) {
        /*
        TODO: Implement this in subclasses.
            1. Check if new positions are valid coordinates.
            2. Check if new positions can be moved into by this Piece type.
            3. Move piece to position and update.
        */
        /*
        Special move cases.
        1. Move 2 spaces as initial move.
        2. Diagonal capture.
        3. Enpasse
        */
        const result = false;

        if (this.faction === this.faction_white) {
            result = this.__isValidMovement(newCoordinateX, newCoordinateY, 1, conditions);
        } else if (this.faction === this.faction_black) {
            result = this.__isValidMovement(newCoordinateX, newCoordinateY, -1, conditions);
        }

        return result;
    }

    
}