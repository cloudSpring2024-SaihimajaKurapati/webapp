const base64 = require('base-64');
const { userModel } = require('../../../HealthCheckDb');

const generateBasicAuthToken = (userName, password) => {
    const credentials = `${userName}:${password}`;
    return base64.encode(credentials);
};

const generateAndStoreToken = async (userName, password) => {
    const token = generateBasicAuthToken(userName, password);
    
    return token;
};

const validateToken = async (token) => {
    try {
        console.log('Received token:', token); 

        if (token.startsWith('Bearer ')) {
            token = token.slice(7);
        }

        // Decode the token to retrieve username
        const decodedToken = base64.decode(token);
        console.log('Decoded token:', decodedToken); // Add this line for debugging

        const [userName] = decodedToken.split(':');
        console.log('Username:', userName); // Add this line for debugging

        // Retrieve the user from the database using the username
        const user = await userModel.findOne({ where: { userName } });

        if (user) {
            return user; 
        }

        return false; 
    } catch (error) {
        console.error('Error validating token:', error);
        return false; // Error occurred while decoding or validating token
    }
};

module.exports = {
    generateAndStoreToken,
    validateToken,
};


