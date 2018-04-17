'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'game_users',
            {
                userid: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                },
                gameid: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                },
                opponentid: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    unique: true
                }
            }
        ).then(() => {
            return queryInterface.addConstraint(
                'game_users', ['userid'], {
                    type: 'foreign key',
                    name: 'game_users_userid_foreign_key',
                    references: {
                        table: 'users',
                        field: 'id'

                    },
                    onDelete: 'cascade',
                    onUpdate: 'cascade'
                }
            ).then(() => {
                return queryInterface.addConstraint(
                    'game_users', ['gameid'], {
                        type: 'foreign key',
                        name: 'game_users_gameid_foreign_key',
                        references: {
                            table: 'games',
                            field: 'id'

                        },
                        onDelete: 'cascade',
                        onUpdate: 'cascade'
                    }
                )
            })
        });
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('game_users');
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */
    }
};
