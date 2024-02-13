require('dotenv').config();
const { Sequelize } = require('sequelize');
const User = require('./src/HealthCheck/model/user');
const config = require('./config');

const { dialect, host, username, password, database } = config.database
const sequelize = new Sequelize( {
    dialect: dialect,
    host: host,
    username: username,
    password: password,
    database: database,
});

const userModel = User(sequelize);
sequelize.sync()
    .then(() => {
        console.log('User table created successfully');
    })
    .catch(err => {
        console.error('Error creating User table:', err);
    });

module.exports = { sequelize, userModel };

