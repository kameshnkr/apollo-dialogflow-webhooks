import express from 'express';

import { setIntent } from '../controllers/general.controller';

const webHookRouter = express.Router();

webHookRouter.post('/setIntent', setIntent);

export default webHookRouter;
