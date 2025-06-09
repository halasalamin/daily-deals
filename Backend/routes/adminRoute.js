import express from 'express';
import userModel from '../models/userModel.js';
import { getMe, loginAdmin, createCompanyWithOwner, getAllCompanies, getCompanyByName, updateCompanyAndOwner,
    deleteCompanyOwner, deleteCompanyByName, getPendingAds, approveAd, rejectAd } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);
adminRouter.get('/me', adminAuth, getMe);
adminRouter.post('/', adminAuth, createCompanyWithOwner);
adminRouter.get('/', adminAuth, getAllCompanies);
adminRouter.get('/company-name/:name', adminAuth, getCompanyByName);
adminRouter.put('/company/update', adminAuth, updateCompanyAndOwner);
adminRouter.delete('/name/:name', adminAuth, deleteCompanyByName);
adminRouter.delete('/owner/:companyId', adminAuth, deleteCompanyOwner);
adminRouter.get('/ads/pending', adminAuth, getPendingAds);
adminRouter.put('/ads/:adId/approve', adminAuth, approveAd);
adminRouter.put('/ads/:adId/reject', adminAuth, rejectAd);


export default adminRouter;

// adminRouter.post('/create-admin', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Validate input
//         if (!email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Email and password are required.'
//             });
//         }

//         // Check if admin already exists
//         const existingAdmin = await userModel.findOne({ email });
//         if (existingAdmin) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Admin already exists in the database.'
//             });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Prepare admin data
//         const adminData = {
//             username: 'Admin',
//             email,
//             password: hashedPassword,
//             role: 'admin',
//             provider: 'local'
//             // intentionally excluding cartData
//         };

//         // Create admin
//         const newAdmin = await userModel.create(adminData);

//         // Remove password and cartData from response
//         const { password: _, cartData, ...sanitizedUser } = newAdmin._doc;

//         // Return sanitized response
//         return res.status(201).json({
//             success: true,
//             message: 'Admin user created successfully.',
//             user: sanitizedUser
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: 'Server error while creating admin user.',
//             error: error.message
//         });
//     }
// });

