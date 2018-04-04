'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'games',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                active: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    constraint: true
                }
            }
        ).then(() => {
            queryInterface.addConstraint(
                'games', ['active'], {
                    type: 'check',
                    name: 'game_active_constraint',
                    where: {
                        active: ['idle', 'not_active', 'active']
                    }
                }
            );
        });
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
