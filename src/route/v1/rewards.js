import express from 'express';
import rewardsController from '../../controllers/rewards.ctrl';

const router = express.Router();

router.post('/rewards', rewardsController.createOne);

module.exports = router;
