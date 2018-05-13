const Game = require('../models/game.js');

class GameManager {

    constructor () {
        this.activeGames = new Map();
    }

    /**
     * Add the given game into a map for quick referencing.
     * @param {Object} gameData A games and game_users database record combined
     * to create a game object representing this active game.
     * @param {*} gamePiecesRecords The game_pieces records of a game.
     */
    addGameInstance(gameId, gameData, gamePiecesRecords) {
        const gameInstance;
        const gameId = gameId;
        
        if (this.activeGames.get(gameId)){
            gameInstance = this.activeGames.get(gameId);
        } else {
            gameInstance = new Game(gameData, gamePiecesRecords)
            this.activeGames.set(gameId, gameInstance);
        }

        return gameInstance;
    }

    removeGameInstance(gameId) {
        return this.activeGames.delete(gameId);
    }

    getGameInstance(gameId) {
        return this.activeGames.get(gameId);
    }
    
    hasGameInstance(gameId) {
        return this.activeGames.has(gameId);
    }
}

module.exports = GameManager;