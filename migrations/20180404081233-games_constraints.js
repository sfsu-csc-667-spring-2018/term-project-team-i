'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addConstraint(
            'games', ['active'],{
                type: 'check',
                name: 'game_active_constraint',
                where:{
                    active: ['idle', 'not_active', 'active']
                }
            }
        );
    },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
