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
    
    moveToPosition(newCoordinateX, newCoordinateY, otherConditions) {
        throw new Error(this.moveToPosition.name + " is abstract and must be implemented.");
    }

}

module.exports = Piece;