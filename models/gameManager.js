const Game = require('../models/game.js');
const GamesDB = require('../db/gamesDB.js');
const gamesDB = new GamesDB();

class GameManager {

    constructor () {
        this.activeGames = new Map();
    }

    /**
     * Creates a new game record and accompanying piece records.
     * @param {*} playerId The player ID to set as host to during game record creation.
     * @param {*} faction The faction of the player.
     * @param {*} callbackFunction The callback to return the game ID of the newly created records.
     */
    createGameInstance(playerId, faction, callbackFunction) {
        gamesDB.createNewGame(playerId, faction, (gameId) => {
            callbackFunction(gameId);
        });
    }

    /**
     * Get the game instance referenced by the given game ID in the internal map. If an instance referenced
     * by this game ID has not been instantiated then it will retrieve the appropriate records from
     * the database and a Game instance will then be made and returned.
     * @param {Number} gameId The game ID of the game instance to find.
     * @param {Function} successCallback A function to pass the Game instance to.
     * @param {Function} failureCallback A function to call in the case of missing game data.
     */
    getGameInstance(gameId, successCallback, failureCallback) {
        let gameInstance = this.activeGames.get(gameId);

        const promise = new Promise((resolve, reject) => {
            if (gameInstance) {
                resolve(gameInstance);
            } else {
                gamesDB.getGameData(gameId, (gameDataRecords) => {
                    if (gameDataRecords.length != 0)
                    {
                        const gameData = gameDataRecords[0];

                        gamesDB.getGamePieces(gameId, (gamePiecesRecords) => {
                            gameInstance = new Game(gameData, gamePiecesRecords);
                            this.activeGames.set(gameId, gameInstance);
                            resolve(gameInstance);
                        });
                    } else {
                        reject(`No game record of ID: ${gameId}!`);
                    }
                });
            }
        })
        .then((gameInstance) => {
            successCallback(gameInstance);
        })
        .catch((error) => {
            failureCallback(error);
        })
    }

    /**
     * Removes the Game instance from the internal map. Note that this does
     * not delete the game data in the database, but only removes the Game instance
     * that is referenced within the internap map.
     * @param {Number} gameId The Game instance to remove / de-reference.
     * @return {Boolean} A boolean determining if a game instance was removed or not.
     */
    removeGameInstance(gameId) {
        return this.activeGames.delete(gameId);
    }
    
    /**
     * Checks if the given game ID is currently within the internal map.
     * @param {*} gameId The game ID to identify if a Game instance is being referenced.
     * @return {Boolean} true or false.
     */
    hasGameInstance(gameId) {
        return this.activeGames.has(gameId);
    }
}

module.exports = GameManager;