import express from 'express';

const genericRouter = express.Router();

genericRouter.get("/healthCheck", (req, res) => {
    res.status(200).json({ success: 'running successfully' });
});

export default genericRouter;
