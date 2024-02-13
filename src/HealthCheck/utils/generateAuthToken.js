const { userModel } = require('../../../HealthCheckDb');
const bcrypt = require('bcrypt');

const validateUser = async (userName, password) => {
    try {
        // Retrieve the user from the database using the username
        const user = await userModel.findOne({ where: { userName } });

        if (user) {
            // Compare the provided password with the hashed password stored in the database
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (isValidPassword) {
                return user; // User is valid
            }
        }

        return false; // User not found or password is incorrect
    } catch (error) {
        console.error('Error validating user:', error);
        return false; // Error occurred while validating user
    }
};

module.exports = {
    validateUser,
};
