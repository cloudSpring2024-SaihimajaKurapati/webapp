const { sequelize, userModel } = require('../../HealthCheckDb');
const bcrypt = require('bcrypt');
const { validateUser } = require('../../src/HealthCheck/utils/generateAuthToken');
const { v4: uuidv4 } = require('uuid');

const getHealthCheck = async (req, res) => {
    if (req.method !== 'GET') {
        return res.set('Cache-Control', 'no-cache').status(405).end();
    }
    try {
        await sequelize.authenticate();
        const headerCount = Object.keys(req.headers).length;
        if (headerCount > 6) {
            return res.status(400).set('Cache-Control', 'no-cache').end();
        }
        return res.set('Cache-Control', 'no-cache').status(200).end();
    } catch (error) {
        console.error(error);
        return res.set('Cache-Control', 'no-cache').status(503).end();
    }
};

const addUsers = async (req, res) => {
    const { firstName, lastName, userName, password, ...rest } = req.body;

    // Check if there are any additional parameters in the request body
    if (Object.keys(rest).length !== 0) {
        return res.status(400).send('Invalid parameters provided');
    }
    try {
        
        const id = uuidv4();

        // Checking if user already exists
        const existingUser = await userModel.findOne({ where: { userName } });
        if (existingUser) {
            return res.status(400).send('User with this email already exists');
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating new user with hashed password and generated UUID
        const newUser = await userModel.create({ id, firstName, lastName, userName, password: hashedPassword });

        // Exclude password from the response
        const responseData = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            userName: newUser.userName,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
        };

        res.status(201).json(responseData);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(400).end();
    }
};

const getUsers = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).send('Unauthorized');
        }

        const encodedCredentials = authHeader.split(' ')[1];
        const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
        const [userName, password] = decodedCredentials.split(':');

        const user = await validateUser(userName, password);

        if (!user) {
            return res.status(401).send('Unauthorized');
        }

        // If the user is valid, fetch the authenticated user (excluding password) and send in response
        const authenticatedUser = await userModel.findOne({ where: { userName }, attributes: { exclude: ['password'] } });
        
        if (!authenticatedUser) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(authenticatedUser);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(400).end();
    }
};



const updateUser = async (req, res) => {
    if (req.method !== 'PUT') {
        return res.set('Cache-Control', 'no-cache').status(405).end();
    }

    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).send('Unauthorized');
        }

        const encodedCredentials = authHeader.split(' ')[1];
        const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
        const [userName, password] = decodedCredentials.split(':');

        const user = await validateUser(userName, password);

        if (!user) {
            return res.status(401).send('Unauthorized');
        }

        // If the user is valid, proceed to update user data
        const { firstName, lastName, password: newPassword, ...rest } = req.body;

        // Check if any fields other than firstName, lastName, and password are being updated
        if (Object.keys(rest).length !== 0) {
            return res.status(400).send('Invalid parameters provided');
        }

        // Check if password is provided and update the password accordingly
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await userModel.update(
                { password: hashedPassword },
                { where: { userName } }
            );
        }

        // Update firstName and lastName
        await userModel.update(
            { firstName, lastName },
            { where: { userName } }
        );

        res.status(204).end();
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(400).end();
    }
};

module.exports = {
    getHealthCheck,
    addUsers,
    getUsers,
    updateUser,
};
