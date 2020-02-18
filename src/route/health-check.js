import express from 'express';
import infoController from '../controllers/info.ctrl';

const router = express.Router();

router.get('/ping', infoController.ping);
router.get('/version', infoController.getVersion);
router.get('/health', infoController.checkHealth);

module.exports = router;
