const GamesDB = require('../../db/gamesDB.js');
const gamesDB = new GamesDB();

class GameMoveValidator {

    constructor() {
        this.validationMap = {
            '1' : this.__validateMovementPawn,
            '2' : this.__validateMovementRook,
            '3' : this.__validateMovementKnight,
            '4' : this.__validateMovementBishop,
            '5' : this.__validateMovementQueen,
            '6' : this.__validateMovementKing,
            '7' : this.__validateMovementPawn,
            '8' : this.__validateMovementRook,
            '9' : this.__validateMovementKnight,
            '10' : this.__validateMovementBishop,
            '11' : this.__validateMovementQueen,
            '12' : this.__validateMovementKing
        }
    }


    /**
     * Validate the movement choice of a given player.
     * @param {Array} gamePieceRecords An array of records of the game_pieces and pieces table that belongs to a single game and are alive.
     * @param {Number} movingPlayerId The user ID belonging to the player whom is trying to move.
     * @param {Number} selectedPieceInfo The selected piece to move and its accompanying data.
     * @param {String} destination_x The destination x-coordinate for the selected piece to move to; x should be a character.
     * @param {String} destination_y The destination y-coordinate for the selected piece to move to; y should be a number literal.
     * @returns {Object} The data object that holds the properties { result: boolean , reason: string }. If movement result is true then no reason is given.
     */
    validateMovement (gamePieceRecords, movingPlayerId, selectedPieceId, destination_x, destination_y) {
        const data = {};
        data.gamePieceRecords = gamePieceRecords,
        data.movingPlayerId = movingPlayerId,
        data.selectedPieceId = selectedPieceId,
        data.destination_x = destination_x,
        data.destination_y = destination_y

        //TODO: implement each mapped function to determine if the given piece can move to desired location.
        //return this.validationMap[selectedPieceId](data);
        return this.__TESTJustMoveMyDamnPiece(data);
    }

    __TESTJustMoveMyDamnPiece(data) {
        return {result: true, message: ""};
    }

    __isPlayerInCheck(gamePieceRecords, movingPlayerId) {
       
    }

    __validateMovementPawn (data)  {
        const outcome = {};
        
    }

    __validateMovementRook (data)  {

    }

    __validateMovementKnight (data)  {

    }

    __validateMovementBishop (data)  {

    }

    __validateMovementQueen (data) {

    }

    __validateMovementKing (data) {

    }
    
}

module.exports = GameMoveValidator;