import express from 'express';

const router = express.Router();

import generalRoutes from './general.routes';
import consultRoutes from './consult.routes';

router.use('/general', generalRoutes);
consultRoutes.use('/consult', consultRoutes);

router.get("/healthCheck", (req, res) => {
    res.status(200).json({ success: 'running successfully' });
});

export default router;
