import { Router } from 'express';
import healthCheckRoutes from './health-check';

const router = Router();

const setRouter = (app) => {

  /**
   * GET status
   */
  router.get('/status', (req, res) => res.json({ status: 'OK' }));

  app.use(healthCheckRoutes);
  app.use('/api/v1', router);

  return router;
};

module.exports = { setRouter };
