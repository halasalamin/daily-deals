import express from 'express';
import { createAd, getAllAds, deleteAd, getApprovedAds, updateAdStatus, getMyAds } from '../controllers/adController.js';
import authUser from '../middleware/auth.js';
import { authorizeAdDelete } from '../middleware/authorizeAdDelete.js';
import companyAuth from '../middleware/companyAuth.js';
import upload from '../middleware/multer.js';

const adsRouter = express.Router();

adsRouter.post('/', companyAuth, upload.single('image'), createAd);
adsRouter.get("/my-ads", companyAuth, getMyAds);
adsRouter.put("/:adId/status", companyAuth, updateAdStatus);
adsRouter.get('/', getAllAds);
adsRouter.delete('/:id', authUser, authorizeAdDelete, deleteAd);
adsRouter.get('/approved', getApprovedAds);


export default adsRouter;