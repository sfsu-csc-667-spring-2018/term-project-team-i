class GamesRenderHelpers {
    
    /**
     * Return an object where the cell's x-coordinate and y-coordinate are used as
     * the keys and the JOINED game_pieces+pieces record are the value.
     * 
     * @example {"a4": [pieceId: '4', name: 'bishop', faction: 'white']}
     * @param {Array} gamePieceRecordsJOINED The array retrieved from the database 
     * that is a JOIN-ing of game_pieces and pieces table.
     */
    static toCellGamePieceObject (gamePieceRecordsJOINED = []) {
        const returnGamePieces = {};

        // Sets the returning elements 
        for (let idx = 0; idx < gamePieceRecordsJOINED.length; idx++) {
            const gamePiece = gamePieceRecordsJOINED[idx];
            const pieceId = gamePiece.pieceid;
            const coordinate_xy = gamePiece.coordinate_x + gamePiece.coordinate_y;
            const name = gamePiece.name;
            const faction = gamePiece.faction;
            const alive = gamePiece.alive;
            
            if (alive) {
                returnGamePieces[coordinate_xy] = {
                    pieceId: pieceId,
                    name: name,
                    faction: faction
                };
            }
        }

        return returnGamePieces;
    }

    static getHandlebarHelpers() {

        const helpers = {
            chessboard_setupBlackOrWhiteClass: (blackClass, whiteClass, cellAlpha, cellNumber) => {
                const alphaNumber = cellAlpha.charCodeAt(0);
                const numberNumber = cellNumber;
                const isCellAlphaEven = (alphaNumber % 2 === 0);
                const isCellNumberEven = (cellNumber % 2 === 0);
        
                return ((isCellAlphaEven && isCellNumberEven) || (!isCellAlphaEven && !isCellNumberEven)) ? whiteClass : blackClass;
            },
        
            chessboard_setupBorderAscii: (base, increments, count, block) => {
                let accumulate = '';
                for (let idx = 0; idx <= count; idx++) {
                    accumulate += block.fn(String.fromCharCode(base));
                    base += increments;
                }
                return accumulate;
            },
        
            chessboard_appendTwoStr: (str1, str2) => {
                return String(str1) + String(str2);
            }
        }

        return helpers;
    }
}

module.exports = GamesRenderHelpers;