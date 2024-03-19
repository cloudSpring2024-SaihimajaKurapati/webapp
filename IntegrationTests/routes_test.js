const { Router } = require('express');
const controller = require('./restController');
const { disablePayloadReqest} = require('../middleware');
const router = Router();

router.all("/healthz", disablePayloadReqest, controller.getHealthCheck);

router.post('/', controller.addUsers);
router.get('/self', controller.getUsers);
router.put('/self', controller.updateUser);

module.exports = router;