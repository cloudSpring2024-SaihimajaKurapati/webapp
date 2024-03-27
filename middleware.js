const disablePayloadReqest = (req, res, next) => {
    

    if (Object.keys(req.query).length !== 0 || Object.keys(req.body).length !==0 ) {

        res.status(400).set('Cache-Control', 'no-cache').end();
    } else {
        next();
    }

};

const { emailVerificationModel } = require('./HealthCheckDb');

const verifyUserMiddleware = (req, res, next) => {
    try {
        const { id } = req.user; // ID from authenticated user
        const EmailVerification = emailVerificationModel(); // Assuming this is synchronous
        const verificationRecord = EmailVerification.findOne({ where: { userId: id } });

        if (verificationRecord && verificationRecord.verified)
            return next();
        
        // If the user is not verified, send a 403 Forbidden response
        return res.status(403).json({ error: 'Your account has not been verified' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    disablePayloadReqest,
    verifyUserMiddleware,
};

