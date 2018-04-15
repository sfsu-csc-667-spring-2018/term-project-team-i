'use strict';
const bcrypt  = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define(
        'users',
        {
            username: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    notNull: true,
                    notEmpty: true
                }
            },
            name: {
                type: DataTypes.STRING,
                validate: {
                    notNull: true,
                    notEmpty: true
                }
            },
            password: {
                type: DataTypes.STRING,
                validate: {
                    notNull: true,
                    notEmpty: true
                }
            },
            email: {
                type: DataTypes.STRING,
                validate: {
                    notNull: true,
                    notEmpty: true
                }
            }
        }
    );
    Users.createUser = ((newUser, callback) =>{
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                newUser.password = hash;
                newUser.save(callback);
            });
        });
    });

    return Users;
};

