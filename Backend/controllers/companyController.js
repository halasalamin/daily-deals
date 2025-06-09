// Import necessary models
import Company from '../models/companyModel.js';

// Get single company by ID
const getCompanyOwnerById = async (req, res) => {
    try {
        // Fetch company by ID and populate 'createdBy' field with name and email
        const company = await Company.findById(req.params.id).populate('createdBy', 'name email');
        
        // If the company is not found
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        // If company is found, return the company data
        res.status(200).json({
            success: true,
            message: "Company retrieved successfully",
            data: company.toObject()
        });

    } catch (error) {
        // Log the error and return failure response
        console.error("Error fetching company:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch company",
            error: error.message
        });
    }
};
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json({
      success: true,
      data: companies.map(company => company.toObject())
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


// Export the controller function
export default {getCompanyOwnerById};
