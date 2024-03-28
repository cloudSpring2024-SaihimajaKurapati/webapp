const { sequelize, userModel, emailVerificationModel } = require('../../HealthCheckDb');
const bcrypt = require('bcrypt');
const { validateUser } = require('../../src/HealthCheck/utils/generateAuthToken');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../logger_file');
const { PubSub } = require('@google-cloud/pubsub');

const pubsub= new PubSub();
const topicName='verify_email';

async function publishMessageToPubSub(message) {
    try {
        await pubsub.topic(topicName).publishJSON(message);
        console.log('Message published to Pub/Sub topic successfully');
    } catch (error) {
        console.error('Error publishing message to Pub/Sub topic:', error);
        throw error;
    }
}

const getHealthCheck = async (req, res) => {
    if (req.method !== 'GET') {
        return res.set('Cache-Control', 'no-cache').status(405).end();
    }
    try {
        await sequelize.authenticate();
        const headerCount = Object.keys(req.headers).length;
        if (headerCount > 6) {
            logger.info('Request not supported')
            return res.status(400).set('Cache-Control', 'no-cache').end();
        }
        return res.set('Cache-Control', 'no-cache').status(200).end();
    } catch (error) {
        console.error(error);
        logger.error('Error in db creation:', error);
        return res.set('Cache-Control', 'no-cache').status(503).end();
    }
};

const addUsers = async (req, res) => {
    const { firstName, lastName, userName, password, ...rest } = req.body;

    // Check if there are any additional parameters in the request body
    if (Object.keys(rest).length !== 0) {
        logger.debug('invalid params provided');
        return res.status(400).send('Invalid parameters provided');
    }
    try {
        
        const id = uuidv4();

        // Checking if user already exists
        const existingUser = await userModel.findOne({ where: { userName } });
        if (existingUser) {
            logger.warn('User with this email already exists');
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
     logger.info('user created successfully')

     await publishMessageToPubSub(responseData);

        res.status(201).json(responseData);
    } catch (error) {
        console.error('Error adding user:', error);
        logger.error('Error adding user:', error);
        res.status(400).end();
    }
};

const getUsers = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            logger.error('unauthorized type');
            return res.status(401).send('Unauthorized');
        }

        const encodedCredentials = authHeader.split(' ')[1];
        const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
        const [userName, password] = decodedCredentials.split(':');

        const user = await validateUser(userName, password);

        if (!user) {
            logger.error('unauthorized user')
            return res.status(401).send('Unauthorized');
        }

        // If the user is valid, fetch the authenticated user (excluding password) and send in response
        const authenticatedUser = await userModel.findOne({ where: { userName }, attributes: { exclude: ['password'] } });
        
        if (!authenticatedUser) {
            return res.status(404).send('User not found');
        }
        logger.info('user retrieved successfully')
        res.status(200).json(authenticatedUser);
    } catch (error) {
        console.error('Error getting users:', error);
        logger.error('Error getting users:', error);
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
            logger.warn('unauthorized user')
            return res.status(401).send('Unauthorized');
        }

        const encodedCredentials = authHeader.split(' ')[1];
        const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
        const [userName, password] = decodedCredentials.split(':');

        const user = await validateUser(userName, password);

        if (!user) {
            logger.warn('unauthorized user');
            return res.status(401).send('Unauthorized');
        }

        // If the user is valid, proceed to update user data
        const { firstName, lastName, password: newPassword, ...rest } = req.body;

        // Check if any fields other than firstName, lastName, and password are being updated
        if (Object.keys(rest).length !== 0) {
            // logger.debug('invalid params provided');
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

        logger.info('user updated successfully')
        res.status(204).end();
    } catch (error) {
        console.error('Error updating user:', error);
        // logger.error('Error updating user:', error);
        res.status(400).end();
    }
};

const verifyUser = async (req, res) => {
    try {
        

        // Retrieve the user ID from the request parameters.
        const { id } = req.params;

        // Find the user by the ID provided in the URL.
        const user = await userModel.findOne({ where: { id } });

        if (!user)
            return res.status(404).send('User not found. Verification link is invalid.');

        // Find the verification record for this user.
        let verificationRecord = await emailVerificationModel.findOne({ where: { userId: id } });

        if (!verificationRecord) {
            // Create a new verification record
            verificationRecord = await emailVerificationModel.create({ userId: id });
    
            // Save the verification record to the database
            await verificationRecord.save();
        }

        // Check if the verification link has expired (2 minutes = 120000 milliseconds).
        if (new Date() - new Date(verificationRecord.sentAt) > 120000)
            return res.status(400).send('Verification link has expired.');

        // If the user is already verified, send an appropriate message.
        if (verificationRecord.verified)
            return res.status(200).send('User is already verified.');

        // Verify the user
        await verificationRecord.update({ verified: true });

        // Send a successful verification message.
        res.status(200).send('User is verified');
    } catch (error) {
        console.error("Error:", error);
        // Handle the error appropriately, maybe send a response indicating failure.
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    getHealthCheck,
    addUsers,
    getUsers,
    updateUser,
    verifyUser,
};
