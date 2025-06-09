import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// User Login
const loginUser = async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        if (!email || !password || !userType) {
            return res.status(400).json({
                success: false,
                message: "Please provide email, password, and user type"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if the role matches the selected user type
        if (
            (userType === "customer" && user.role !== "customer") ||
            (userType === "companyOwner" && user.role !== "company")
        ) {
            return res.status(403).json({
                success: false,
                message: "User type mismatch"
            });
        }

        if (user.provider !== 'local') {
            return res.status(400).json({
                success: false,
                message: `Please login using your ${user.provider} account`
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = createToken(user._id);
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                provider: user.provider,
                companyId: user.companyId
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// User Registration
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const trimmedEmail = email.trim();
        const trimmedUsername = username.trim();

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({
                success: false,
                message: "Email already in use"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters including uppercase, lowercase, number, and symbol"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
            provider: 'local'
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.userType,
                provider: user.provider,
                companyId: user.companyId
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// Social Login (Facebook/Google)
const socialLogin = async (req, res) => {
    try {
        const { email, name, provider, providerId } = req.body;

        if (!email || !provider) {
            return res.status(400).json({
                success: false,
                message: "Email and provider are required"
            });
        }

        let user = await userModel.findOne({
            $or: [
                { email },
                { providerId }
            ]
        });

        if (!user) {
            // Create new user if not found
            user = new userModel({
                username: name || email.split('@')[0],
                email,
                provider,
                providerId
            });
            await user.save();
        } else {
            // If user exists but with a different provider
            if (user.provider !== provider) {
                // Allow linking only if email matches and Facebook is being added
                if (user.email === email && provider !== 'local') {
                    user.provider = provider;
                    user.providerId = providerId;
                    await user.save();
                } else {
                    return res.status(400).json({
                        success: false,
                        message: `This account is already registered using ${user.provider}`
                    });
                }
            }
        }

        const token = createToken(user._id);
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                userType: user.userType,
                provider: user.provider,
                companyId: user.companyId
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user.toObject()
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

const uploadProfilePhoto = async (req, res) => {
    try {
        console.log("File received:", req.file);
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const result = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image"
        });

        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Save Cloudinary URL to user profile
        user.profilePhoto = result.secure_url;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile photo uploaded successfully",
            data: {
                profilePhoto: result.secure_url
            }
        });

    } catch (error) {
        console.error("UPLOAD ERROR:", error.message, error.stack);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { username, email, password } = req.body;

    try {
        // Check if name or email is used by someone else
        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }],
            _id: { $ne: userId }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already in use' });
        }

        // Prepare update object
        const updateData = {};

        if (username) updateData.username = username.trim();
        if (email) updateData.email = email.trim().toLowerCase();
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({ message: 'Password must be at least 8 characters long' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        await userModel.findByIdAndUpdate(userId, updateData, { new: true });

        res.status(200).json({ message: 'Profile updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export { loginUser, registerUser, socialLogin, getMe, uploadProfilePhoto, updateProfile };