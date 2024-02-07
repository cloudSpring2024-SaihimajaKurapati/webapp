const { sequelize, userModel } = require('../../HealthCheckDb');
const bcrypt = require('bcrypt');
const { generateAndStoreToken, validateToken } = require('../../src/HealthCheck/utils/generateAuthToken');
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

        // Generate and store token for the new user
        const token = await generateAndStoreToken(userName, password);

        // Return the user details with token in the response
        const responseData = {
            id,
            first_name: newUser.firstName,
            last_name: newUser.lastName,
            username: newUser.userName,
            account_created: newUser.createdAt,
            account_updated: newUser.updatedAt,
            token: token 
        };

        res.status(201).json(responseData);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(400).end();
    }
};

const getUsers = async (req, res) => {
    try {

        const token = req.headers['authorization'];

        
        const user = await validateToken(token);

        if (!user) {
            
            return res.status(401).send('Unauthorized');
        }

        // If the token is valid, proceed to retrieve user data
        // Fetch the authenticated user (excluding password) and send in response
        const authenticatedUser = await userModel.findOne({ where: { userName: user.userName }, attributes: { exclude: ['password'] } });
        
        if (!authenticatedUser) {
            
            return res.status(404).send('User not found');
        }

        // Rename fields createdAt and updatedAt
        const responseData = {
            ...authenticatedUser.toJSON(),
            id: authenticatedUser.id, // Include the id field
            account_created: authenticatedUser.createdAt,
            account_updated: authenticatedUser.updatedAt,
        };
        delete responseData.createdAt;
        delete responseData.updatedAt;

        res.status(200).json(responseData);
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
        const token = req.headers['authorization'];

        const user = await validateToken(token);

        if (!user) {
            return res.status(401).send('Unauthorized');
        }

        // If the token is valid, proceed to update user data
        const { firstName, lastName, password, ...rest } = req.body;

        // Check if any fields other than firstName, lastName, and password are being updated
        if (Object.keys(rest).length !== 0) {
            return res.status(400).end();
        }

        // Check if any of the fields are being updated
        const updateFields = {};
        if (firstName) {
            updateFields.firstName = firstName;
        }
        if (lastName) {
            updateFields.lastName = lastName;
        }
        if (password) {
            updateFields.password = await bcrypt.hash(password, 10);
        }

        // Update user details
        await userModel.update(
            updateFields,
            { where: { userName: user.userName } }
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

