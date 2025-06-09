import express from 'express';

import { companyPredict , adminPredict } from '../controllers/predictController.js';
import companyAuth from '../middleware/companyAuth.js';
import adminAuth from '../middleware/adminAuth.js';

const predictRouter = express.Router();
predictRouter.post('/predict',adminAuth , adminPredict);
predictRouter.post('/user',companyAuth , companyPredict);

export default predictRouter;