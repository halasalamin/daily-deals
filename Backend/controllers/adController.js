import adsModel from "../models/adsModel.js";
import companyModel from "../models/companyModel.js";
import { v2 as cloudinary } from "cloudinary";

// Controller: Get all ads of the logged-in company
export const getMyAds = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    if (!companyId) {
      return res.status(403).json({ message: "User is not linked to any company" });
    }
    const ads = await adsModel.find({ companyId }).sort({ startTime: -1 });
    const plainAds = ads.map(ad => ad.toObject());
    console.log("Ads found:", plainAds.length);
    res.status(200).json(plainAds);
  } catch (error) {
    console.error("Failed to fetch ads", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Controller: Update ad status
export const updateAdStatus = async (req, res) => {
  const { adId } = req.params;
  const { status, rejectionReason } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const ad = await adsModel.findById(adId).populate("companyId");

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    ad.status = status;

    if (status === "rejected") {
      ad.rejectionReason = rejectionReason || "No reason provided";
      console.log(`Ad rejected. Notify ${ad.companyId.name || ad.companyId._id}: ${ad.rejectionReason}`);
    } else {
      ad.rejectionReason = "";
    }

    await ad.save();

    res.status(200).json({ message: `Ad ${status} successfully`, ad });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const createAd = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    if (!companyId) {
      return res.status(403).send('User is not linked to any company');
    }

    const company = await companyModel.findById(companyId);
    if (!company) return res.status(404).send('Company not found');

    const { startTime, endTime } = req.body;
    if (!startTime || !endTime) return res.status(400).send('Start and end time required');
    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).send('End time must be after start time');
    }

    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).send('Ad image is required');
    }

    const result = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const ad = new adsModel({
      startTime,
      endTime,
      companyId,
      imageUrl: result.secure_url,
      status: 'pending'
    });

    await ad.save();

    res.status(201).json({ message: 'Ad created and pending admin approval', ad });
  } catch (err) {
    console.error('Create Ad Error:', err);
    res.status(500).send('Server error');
  }
};

export const getAllAds = async (req, res) => {
  try {
    const ads = await adsModel.find();
    const companyIds = [...new Set(ads.map(ad => ad.companyId.toString()))];
    const companies = await companyModel.find({ _id: { $in: companyIds } }, '_id name');

    const companyMap = {};
    companies.forEach(company => {
      companyMap[company._id.toString()] = company.name;
    });

    const adsWithCompanyName = ads.map(ad => ({
      ...ad.toObject(),
      companyName: companyMap[ad.companyId.toString()] || ad.companyId
    }));

    res.json({ advertisements: adsWithCompanyName });
  } catch (err) {
    console.error('Error fetching ads:', err);
    res.status(500).send('Server Error');
  }
};

export const getApprovedAds = async (req, res) => {
  try {
    const ads = await adsModel.find({ status: 'approved' }).populate('companyId', 'name');
    res.status(200).json(ads);

  } catch (err) {
    console.error('Get Approved Ads Error:', err);
    console.error('Get Latest Approved Ad Image Error:', err);
    res.status(500).send('Server error');
  }
};



export const deleteAd = async (req, res) => {
  const result = await adsModel.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).send('Ad not found');
  res.send('Ad deleted');
};
