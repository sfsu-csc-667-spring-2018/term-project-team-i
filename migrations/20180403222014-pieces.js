'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
        'pieces',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type:Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            faction: {
                type:Sequelize.STRING,
                allowNull: false,
                constraint: true
            }
        }
    ).then(() => {
        return queryInterface.addConstraint(
            'pieces', ['name'],
            {
                type: 'check',
                name: 'piece_name_constraint',
                where: {
                    name: ['pawn', 'rook', 'bishop', 'knight', 'queen', 'king'],
                }
            }
        );
    }).then(() => {
        return queryInterface.addConstraint(
            'pieces', ['faction'],
            {
                type: 'check',
                name: 'faction_name_constraint',
                where: {
                    faction: ['white', 'black']
                }
            }
          );
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('pieces');
  }
};