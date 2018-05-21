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
     * @return {{result: boolean, message: String}} An object containing the result and corresponding message.
     */
    isValidMovement(idx_destination_x, idx_destination_y, chessboard = [], otherConditions) {
        throw new Error(this.isValidMovement.name + " is abstract and must be implemented.");
    }

    /**
     * Find the first Piece object by scanning toward the given direction using the given incrementing values.
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
     * Determines if the given origin piece is blocked by another given piece from reaching its destination coordinates.
     * @param {Piece} originPiece The Piece attempting to reach its destination.
     * @param {Piece} possibleBlockingPiece The other Piece that may possible be blocking the origin Piece.
     * @param {Number} idx_destination_x The destination x-coordinates to reach.
     * @param {Number} idx_destination_y The destination y-coordinates to reach.
     * @return {boolean} true if the possibly blocking Piece is blocking, false otherwise or if either Pieces are undefined.
     */
    static isOtherPieceBlocking(originPiece, possibleBlockingPiece, idx_destination_x, idx_destination_y) {
        if (!originPiece || !possibleBlockingPiece) return false;

        const xDestinationDiff = idx_destination_x - originPiece.coordinateXConverted;
        const yDestinationDiff = idx_destination_y - originPiece.coordinateYConverted;
        const xHitPieceDiff = possibleBlockingPiece.coordinateXConverted - originPiece.coordinateXConverted;
        const yHitPieceDiff = possibleBlockingPiece.coordinateYConverted - originPiece.coordinateYConverted;

        const magnitudeDest = Math.sqrt(Math.pow(xDestinationDiff, 2) + Math.pow(yDestinationDiff, 2));
        const magnitudeHit = Math.sqrt(Math.pow(xHitPieceDiff, 2) + Math.pow(yHitPieceDiff, 2));

        return (magnitudeHit < magnitudeDest);
    }

    /**
     * Converts the given number to the proper string character as reflected on the x-axis of the chessboard.
     * In other words, it will add 97 to the given value and return the character representation based on the ASCII table.
     * @param {Number} idx_coordinate_x The value to convert to x-coordinate reflected at the chessboard.
     * @return {String} The x-coordinate value as a string.
     */
    static coordinateXAsRaw(idx_coordinate_x) {
        // x are 'a' - 'h'
        if (isNaN(idx_coordinate_x)) {
            throw new Error(idx_coordinate_x + " is not a number!");
        }

        return String.fromCharCode(97 + idx_coordinate_x);
    }

    /**
     * Converts the given number to the proper string 'number' as reflected on the y-axis of the chessboard.
     * In other words, it will increment the given value by one and return it as a string.
     * @param {Number} idx_coordinate_y The value to convert to y-coordinate reflected at the chessboard.
     * @return {String} The y-coordinate value as a string.
     */
    static coordinateYAsRaw(idx_coordinate_y) {
        // y are '1' - '8'
        if (isNaN(idx_coordinate_y)) {
            throw new Error(idx_coordinate_y + " is not a number!");
        } 

        return (idx_coordinate_y + 1).toString();
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