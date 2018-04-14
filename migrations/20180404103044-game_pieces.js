'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
        return queryInterface.createTable(
            'game_pieces',
            {
                gameid: {
                    type: Sequelize.INTEGER,
                    unique: true,
                    allowNull:false
                },
                userid: {
                    type: Sequelize.INTEGER,
                    unique: true,
                    allowNull:false
                },
                pieceid: {
                    type: Sequelize.INTEGER,
                    unique: true,
                    allowNull:false
                },
                coordinate_x: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                coordinate_y: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                alive: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false
                }
            }).then(() => {
                return queryInterface.addConstraint(
                'game_pieces', ['userid'], {
                    type: 'foreign key',
                    name: 'game_pieces_userid_foreign_key',
                    references: {
                        table: 'users',
                        field: 'id'
                    },
                    onDelete: 'cascade',
                    onUpdate: 'cascade'
                }
            )
        }).then(() => {
            return queryInterface.addConstraint(
                'game_pieces', ['gameid'], {
                    type: 'foreign key',
                    name: 'game_pieces_gameid_foreign_key',
                    references: {
                        table: 'games',
                        field: 'id'

                    },
                    onDelete: 'cascade',
                    onUpdate: 'cascade'
                }
            )
        }).then(() => {
            return queryInterface.addConstraint(
                'game_pieces', ['pieceid'], {
                    type: 'foreign key',
                    name: 'game_pieces_pieceid_foreign_key',
                    references: {
                        table: 'pieces',
                        field: 'id'

                    },
                    onDelete: 'cascade',
                    onUpdate: 'cascade'
                }
            )
        }).then(() => {
            return queryInterface.addConstraint(
                'game_pieces', ['coordinate_x'], {
                    type: 'check',
                    name: 'game_pieces_coordinate_x_constraint',
                    where: {
                        coordinate_x: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
                    }
                }
            )
        }).then(() => {
            return queryInterface.addConstraint(
                'game_pieces', ['coordinate_y'], {
                    type: 'check',
                    name: 'game_pieces_coordinate_y_constraint',
                    where: {
                        coordinate_y: ['1', '2', '3', '4', '5', '6', '7', '8']
                    }
                }
            )
        })
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('game_pieces');
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */
    }
};
