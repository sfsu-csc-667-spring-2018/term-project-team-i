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
                    unique: false,
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
        }).then(() => {

            const names = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
            const factions = ['white', 'black'];
            const bulkInserts = [];

            for (let fdx = 0; fdx < factions.length; fdx++) {
                for (let ndx = 0; ndx < names.length; ndx++) {
                    bulkInserts.push(
                        {
                            "name": names[ndx],
                            "faction": factions[fdx]
                        }
                    )
                }
            }

            return queryInterface.bulkInsert(
                'pieces', bulkInserts
            )
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('pieces');
    }
};