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

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  /*
  up: (queryInterface, Sequelize) => {
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
  },
  */
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('pieces');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
