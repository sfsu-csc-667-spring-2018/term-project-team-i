'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'users',
            {
                userid: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                username:{
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                password: {
                    type:Sequelize.STRING,
                    allowNull: false
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                sessionkey: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                }
            }
        );
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('users');
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */
    }
};
