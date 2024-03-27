const disablePayloadReqest = (req, res, next) => {
    

    if (Object.keys(req.query).length !== 0 || Object.keys(req.body).length !==0 ) {

        res.status(400).set('Cache-Control', 'no-cache').end();
    } else {
        next();
    }

};

const { userModel, emailVerificationModel } = require('./HealthCheckDb'); 

const verifyUserMiddleware = async (req, res, next) => {
    try {
        const User = await userModel;
        const EmailVerification = await emailVerificationModel;

        // Retrieve the user ID from the request parameters.
        const { id } = req.params;

        // Find the user by the ID provided in the URL.
        const user = await User.findByPk(id);

        if (!user)
            return res.status(404).send('User not found. Verification link is invalid.');

        // Find the verification record for this user.
        const verificationRecord = await EmailVerification.findOne({ where: { userId: id } });

        if (!verificationRecord)
            return res.status(404).send('Verification record not found. Link may be invalid.');

        // Check if the verification link has expired (2 minutes = 120000 milliseconds).
        if (new Date() - new Date(verificationRecord.sentAt) > 120000)
            return res.status(400).send('Verification link has expired.');

        // If the user is not verified, prevent access to GET and PUT requests.
        if (!verificationRecord.verified) {
            return res.status(401).send('User is not verified. Access denied.');
        }

        // User is verified, allow access to GET and PUT requests.
        next();
    } catch (error) {
        console.error("Error:", error);
        // Handle the error appropriately, maybe send a response indicating failure.
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    disablePayloadReqest,
    verifyUserMiddleware,
};

