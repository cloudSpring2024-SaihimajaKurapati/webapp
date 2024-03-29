const { Router } = require('express');
const controller = require('./HealthCheckController');
const { disablePayloadReqest, verifyUserMiddleware} = require('../../middleware');
const router = Router();

router.all("/healthz", disablePayloadReqest, controller.getHealthCheck);

router.post('/', controller.addUsers);
router.get('/self', controller.getUsers);
router.put('/self', controller.updateUser);
router.get('/verify/:id', controller.verifyUser);

module.exports = router;