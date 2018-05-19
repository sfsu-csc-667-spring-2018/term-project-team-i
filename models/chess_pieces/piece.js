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
        this.alive = gamePieceRecord.alive;
    }

    get coordinateXConverted() {
        return Piece.coordinateXConversion(this.raw_coordinate_x);
    }

    get coordinateYConverted() {
        return Piece.coordinateYConversion(this.raw_coordinate_y);
    }
    
    /**
     * Determines if the given destinations are valid positions the piece can move to.
     * The Pieces will also determine if there are blocking pieces in its path that prevents
     * it from moving the destination. The Piece will also validate if the destination piece
     * is of the opposing faction.
     * @param {Number} idx_destination_x The x coordinate destination in NUMBER form (0 to 7).
     * @param {Number} idx_destination_y The y coordinate destination in NUMBER form (0 to 7).
     * @param {Array} chessboard The array containing all the active game pieces currently on the chessboard.
     * @param {Object} otherConditions Optional conditions for special pieces just in case.
     * @return {boolean}
     */
    isValidMovement(idx_destination_x, idx_destination_y, chessboard = [], otherConditions) {
        throw new Error(this.isValidMovement.name + " is abstract and must be implemented.");
    }

    /**
     * Find the first Piece object scanning toward the given direction.
     * @param {Number} origin_x The starting x-coordinate position (Note that this value is incremented by origin_incX at start).
     * @param {Number} origin_y The starting y-coordinate position (Note that this value is incremented by origin_incY at start).
     * @param {Number} origin_incX The increment to add to the origin x-coordinate.
     * @param {Number} origin_incY The increment to add to the origin y-coordinate.
     * @param {Array[]} chessboard The chessboard 2D array where Pieces are located in.
     * @param {Number} chessboardSize The chessboard dimension.
     * @return {(Piece|undefined)} The first hit object in the scan or undefined if the chessboard size was reached.
     */
    static getFirstPieceScan(origin_x, origin_y, origin_incX, origin_incY, chessboard, chessboardSize = 8) {
        let hitPiece = undefined;

        for (let col = origin_x + origin_incX, row = origin_y + origin_incY; 
                                        (col >= 0 && col < chessboardSize && row >= 0 && row < chessboardSize);
                                                                                col += origin_incX, row += origin_incY) {
            if (chessboard[col]) {
                hitPiece = chessboard[col][row];
                if (hitPiece != undefined) {
                    break;
                }
            }
        }

        return hitPiece;
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