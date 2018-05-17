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
        this.raw_coordinate_x = gamePieceRecord.coordinate_x;
        this.raw_coordinate_y = gamePieceRecord.coordinate_y;
        this.idx_coordinate_x = Piece.coordinateXConversion(this.raw_coordinate_x);
        this.idx_coordinate_y = Piece.coordinateYConversion(this.raw_coordinate_y);
        this.alive = gamePieceRecord.alive;
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
        throw new Error(this.isValidMovement.name + " is abstract and must be implemented.");
    }

    /**
     * converts string x coordinates to numbers - 1 for indexes
     * @param {String} raw_coordinateX
     * @returns {number}
     */
    static coordinateXConversion(raw_coordinateX){
        return raw_coordinateX.charCodeAt(0) - 97; //a = 0, b = 1 ...
    }

    /**
     * converts string y coordinates to numbers - 1 for indexes
     * @param {String} raw_coordinateY
     * @returns {number}
     */
    static coordinateYConversion(raw_coordinateY){
        return Number(raw_coordinateY) - 1;
    }
}

module.exports = Piece;