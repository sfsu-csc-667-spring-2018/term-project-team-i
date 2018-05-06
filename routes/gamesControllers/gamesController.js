class GamesController {

    constructor () {

    }

    getChessPiecesArray(gamePieceRecords = [], pieceRecords = []) {
        const returnGamePieces = {};
        const pieces = {};

        // SUGGESTION: use a sql JOIN statement instead of aggregating pieces server side as an array after SELECT.
        for (let jdx = 0; jdx < pieceRecords.length; jdx++) {
            pieces[pieceRecords[jdx].id] = {
                name: pieceRecords[jdx].name,
                faction: pieceRecords[jdx].faction
            };
        }

        // Sets the returning elements 
        for (let idx = 0; idx < gamePieceRecords.length; idx++) {
            const gamePiece = gamePieceRecords[idx];
            const pieceid = gamePiece.pieceid;
            const coordinate_xy = gamePiece.coordinate_x + gamePiece.coordinate_y;
            const alive = gamePiece.alive;
            
            if (alive) {
                returnGamePieces[coordinate_xy] = {
                    name: pieces[pieceid].name,
                    faction: pieces[pieceid].faction
                };
            }
        }

        return returnGamePieces;
    }
}

module.exports = GamesController;