import { Router } from 'express';
import rewardsController from '../../controllers/rewards.ctrl';

const router = Router();
router.post('/api/v1/rewards', rewardsController.createOne);

module.exports = router;
