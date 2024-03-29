require('dotenv').config();
const { Sequelize } = require('sequelize');
const User = require('./src/HealthCheck/model/user');
const EmailVerification = require('./src/HealthCheck/model/userEmailVerification');

const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const userModel = User(sequelize);
const emailVerificationModel = EmailVerification(sequelize);

const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');

        // Synchronize models with the database
        await sequelize.sync();
        console.log('Models synchronized successfully');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, userModel, emailVerificationModel, initializeDatabase };