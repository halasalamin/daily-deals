import jwt from 'jsonwebtoken';
import Joi from 'joi';
import Company from '../models/companyModel.js';
import userModel from '../models/userModel.js';
import adsModel from '../models/adsModel.js';
import productModel from '../models/productModel.js';
import bcrypt from 'bcrypt';

// Company update validation
const companyUpdateSchema = Joi.object({
    companyId: Joi.string().required(),
    name: Joi.string().min(3).max(50).optional(),
    description: Joi.string().min(5).max(255).optional()
  }); // At least one must be provided
  
  // Owner update validation
  const ownerUpdateSchema = Joi.object({
    companyId: Joi.string().required(),
    username: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(8).optional()
  }); // At least one must be provided

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Admin not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied: Not an admin" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1y" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};


const getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User fetched successfully',
        token: req.header('Authorization')?.replace('Bearer ', ''),
        data: req.user
    });
};

const createCompanyWithOwner = async (req, res) => {
  try {
    const { companyName, description, username, email, password } = req.body;

    if (!companyName || !description || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists"
      });
    }

    const company = new Company({ name: companyName, description });
    const savedCompany = await company.save();

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      username,
      email,
      password: hashedPassword,
      role: 'company',
      companyId: savedCompany._id
    });
    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: "Company and owner created successfully",
      data: {
        companyId: savedCompany._id,
        companyName: savedCompany.name,
        ownerUsername: savedUser.username
      }
    });

  } catch (error) {
    console.error("Error in createCompanyWithOwner:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


const getAllCompanies = async (req, res) => {
  try {
      const companies = await Company.find();

      const companiesWithOwners = await Promise.all(
          companies.map(async (company) => {
              const owner = await userModel.findOne(
                  { companyId: company._id, role: 'company' },
                  'username email'
              );

              return {
                  id: company._id,
                  name: company.name,
                  description: company.description,
                  owner: owner ? {  
                      username: owner.username,
                      email: owner.email
                  } : null
              };
          })
      );

      res.status(200).json({
          success: true,
          message: "Companies retrieved successfully",
          data: companiesWithOwners
      });

  } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({
          success: false,
          message: "Failed to fetch companies",
          error: error.message
      });
  }
};


const getCompanyByName = async (req, res) => {
  try {
    const searchQuery = req.params.name;

    // Find company by name (case-insensitive)
    const company = await Company.findOne({ name: new RegExp(`^${searchQuery}$`, 'i') });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    // Find owner for this company
    const owner = await userModel.findOne(
      { companyId: company._id, role: 'company' },
      'username email'
    );

    return res.status(200).json({
      success: true,
      message: "Company retrieved successfully",
      data: {
        id: company._id,              // add id for front-end usage
        name: company.name,
        description: company.description,
        owner: owner || null
      }
    });

  } catch (error) {
    console.error("Error fetching company:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch company",
      error: error.message
    });
  }
};


const updateCompanyAndOwner = async (req, res) => {
  try {
    const { companyId, name, description, username, email, password } = req.body;
    console.log('Validating company data:', { companyId, name, description });
    console.log('Validating owner data:', { username, email, password });

    if (!companyId) {
      return res.status(400).json({ success: false, message: '"companyId" is required' });
    }

    // Validate company fields only if at least one company field is present
    if (name !== undefined || description !== undefined) {
      const companyValidation = companyUpdateSchema.validate({ companyId, name, description });
      if (companyValidation.error)
        return res.status(400).json({ success: false, message: companyValidation.error.details[0].message });
    }

    // Validate owner fields only if at least one owner field is present
    if (username !== undefined || email !== undefined || password !== undefined) {
      const ownerValidation = ownerUpdateSchema.validate({ companyId, username, email, password });
      if (ownerValidation.error)
        return res.status(400).json({ success: false, message: ownerValidation.error.details[0].message });
    }

    const company = await Company.findById(companyId);
    if (!company)
      return res.status(404).json({ success: false, message: 'Company not found' });

    if (name !== undefined) company.name = name;
    if (description !== undefined) company.description = description;
    await company.save();

    const user = await userModel.findOne({ companyId });
    if (!user)
      return res.status(404).json({ success: false, message: 'Company owner not found' });

    if (username && username !== user.username) {
      const usernameExists = await userModel.findOne({ username });
      if (usernameExists)
        return res.status(409).json({ success: false, message: 'Username already taken' });
      user.username = username;
    }

    if (email && email !== user.email) {
      const emailExists = await userModel.findOne({ email });
      if (emailExists)
        return res.status(409).json({ success: false, message: 'Email already in use' });
      user.email = email;
    }

    if (password) {
      if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters and include a capital letter and number'
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Company and owner updated successfully',
      company,
      owner: {
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

  const deleteCompanyByName = async (req, res) => {
  try {
    const company = await Company.findOne({ name: req.params.name });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Soft-delete products by marking them unavailable
    const products = await productModel.find({ companyId: company._id });

    let updatedProductsCount = 0;
    if (products.length > 0) {
      const result = await productModel.updateMany(
        { companyId: company._id },
        { $set: { status: "unavailable" } }
      );
      updatedProductsCount = result.modifiedCount;
    }

    // Delete the company owner
    const deletedOwner = await userModel.findOneAndDelete({
      companyId: company._id,
      userType: "company",
    });

    // Delete the company itself
    await company.deleteOne();

    res.status(200).json({
      success: true,
      message: "Company and owner deleted. Products marked as unavailable. Orders preserved.",
      data: {
        company,
        deletedOwner,
        updatedProductsCount,
      },
    });
  } catch (error) {
    console.error("Error deleting company by name:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete company",
      error: error.message,
    });
  }
};

  

const deleteCompanyOwner = async (req, res) => {
    try {
      const { companyId } = req.params;
  
      const deletedOwner = await userModel.findOneAndDelete({
        companyId,
        userType: 'company',
      });
  
      if (!deletedOwner) {
        return res.status(404).json({
          success: false,
          message: 'Company owner not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Company owner deleted successfully',
        data: deletedOwner,
      });
    } catch (error) {
      console.error('Error deleting company owner:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete company owner',
        error: error.message,
      });
    }
  };


const getPendingAds = async (req, res) => {
  try {
    const pendingAds = await adsModel.find({ status: 'pending' }).populate('companyId', 'name email');
    res.status(200).json(pendingAds);
  } catch (err) {
    console.error('Error fetching pending ads:', err);
    res.status(500).send('Server error');
  }
};

const approveAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const ad = await adsModel.findById(adId);
    if (!ad) return res.status(404).send('Ad not found');

    ad.status = 'approved';
    ad.rejectionReason = '';
    await ad.save();

    res.status(200).json({ message: 'Ad approved successfully', ad });
  } catch (err) {
    console.error('Approve Ad Error:', err);
    res.status(500).send('Server error');
  }
};

const rejectAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason || rejectionReason.trim() === '') {
      return res.status(400).send('Rejection reason is required');
    }

    const ad = await adsModel.findById(adId).populate('companyId');
    if (!ad) return res.status(404).send('Ad not found');

    ad.status = 'rejected';
    ad.rejectionReason = rejectionReason;
    await ad.save();

    // Simulate notification to company
    console.log(`Ad rejected. Notify ${ad.companyId.name || ad.companyId._id}: ${rejectionReason}`);

    res.status(200).json({ message: 'Ad rejected successfully', ad });
  } catch (err) {
    console.error('Reject Ad Error:', err);
    res.status(500).send('Server error');
  }
};



export {
    loginAdmin, getMe, createCompanyWithOwner, getAllCompanies, getCompanyByName, updateCompanyAndOwner,
    deleteCompanyOwner, deleteCompanyByName, getPendingAds, approveAd, rejectAd };
