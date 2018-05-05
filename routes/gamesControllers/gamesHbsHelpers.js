/**
 * Used as rendering data for Handlebars in regards to setting up the game room.
 */
const gamesHbsHelpers = {

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

module.exports = gamesHbsHelpers;