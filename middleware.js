const disablePayloadReqest = (req, res, next) => {
    

    if (Object.keys(req.query).length !== 0 || Object.keys(req.body).length !==0 ) {

        res.status(400).set('Cache-Control', 'no-cache').end();
    } else {
        next();
    }

};

module.exports = {
    disablePayloadReqest
};

