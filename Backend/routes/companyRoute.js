import express from 'express';
import getCompanyOwnerById from '../controllers/companyController.js'; // Correct the import here
// import adminAuth from '../middleware/adminAuth.js';
// import companyAuth from '../middleware/companyAuth.js';
const companyRouter = express.Router();

// Define the route for getting a company by ID, protected by 'auth' middleware
// companyRouter.get('/:id', auth, getCompanyOwnerById);

export default companyRouter;
