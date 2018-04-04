'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'games',
            {
                gameid: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                active: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    constraint:true
                }
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('games');
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */
    }
};
