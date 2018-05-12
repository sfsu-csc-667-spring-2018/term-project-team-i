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
    
    moveToPosition(newCoordinateX, newCoordinateY) {
        throw new Error(this.moveToPosition.name + " is abstract and must be implemented.");
        /*
        TODO: Implement this in subclasses.
            1. Check if new positions are valid coordinates.
            2. Check if new positions can be moved into by this Piece type.
            3. Move piece to position and update.
        */
    }

}

module.exports = Piece;