require('dotenv').config();
const { Sequelize } = require('sequelize');
const User = require('./src/HealthCheck/model/user');
const emailVerification = require('./src/HealthCheck/model/userEmailVerification');

const sequelize = new Sequelize( {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const userModel = User(sequelize);
const emailVerificationModel = emailVerification(sequelize); 
sequelize.sync()
    .then(() => {
        console.log('User table and email verification table created successfully');
    })
    .catch(err => {
        console.error('Error creating User table:', err);
    });

module.exports = { sequelize, userModel, emailVerificationModel };

