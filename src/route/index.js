import { Router } from 'express';
import healthCheckRoutes from './health-check';
import studentRoutes from './v1/student';
import rewardsRoutes from './v1/rewards';

const router = Router();

const setRouter = (app) => {

  /**
   * GET status
   */
  router.get('/status', (req, res) => res.json({ status: 'OK' }));

  // health check does not need version
  app.use(healthCheckRoutes);

  // version for all other endpoints
  app.use('/api/v1', studentRoutes);
  app.use('/api/v1', rewardsRoutes);

  return router;
};

module.exports = { setRouter };
