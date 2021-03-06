import { Router } from 'express';
import infoController from '../controllers/info.ctrl';

const router = Router();
router.get('/status', (req, res) => { res.json({ status: 'OK' }) } );
router.get('/ping', infoController.ping);
router.get('/version', infoController.getVersion);
router.get('/health', infoController.checkHealth);

module.exports = router;
