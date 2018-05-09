class GamesHbsHelpers {
    
    /**
     * 
     * @param {*} gamePieceRecordsJOINED 
     * @param {*} pieceRecords 
     */
    static combineToRenderChessPieces (gamePieceRecordsJOINED = []) {
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

    static getHelpers() {

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

module.exports = GamesHbsHelpers;