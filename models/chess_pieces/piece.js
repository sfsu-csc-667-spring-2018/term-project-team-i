class Piece {

    constructor (gamePieceRecord) {
        
        if (this.constructor === Piece) {
            throw new TypeError('Abstract class "Piece" cannot be instantiated.');
        }
        
        this.gameId = gamePieceRecord.gameid;
        this.userId = gamePieceRecord.userid;
        this.pieceId = gamePieceRecord.pieceid;
        this.name = gamePieceRecord.name;
        this.faction = gamePieceRecord.faction;
        this.coordinate_x = gamePieceRecord.coordinate_x;
        this.coordinate_y = gamePieceRecord.coordinate_y;
        this.alive = gamePieceRecord.alive;
    }
    
    /**
     * Determines if the given destination coordinates are allowed to be moved
     * into by this piece's movement rules.
     * @param {String} newCoordinateX The destination x coordinates to move to.
     * @param {String} newCoordinateY The destination y coordinates to move to.
     * @param {Array} allGamePieces The other active game pieces on the board to check for collisions.
     * @param {Object} otherConditions Optional parameters for potential fringe cases.
     */
    isValidMovement(newCoordinateX, newCoordinateY, allGamePieces = [], otherConditions) {
        throw new Error(this.isValidMovement.name + " is abstract and must be implemented.");
    }

}

module.exports = Piece;