import adsModel from "../models/adsModel.js";

export const authorizeAdDelete = async (req, res, next) => {
    try {
      const ad = await adsModel.findById(req.params.id);
      if (!ad) return res.status(404).send('Ad not found');
  
      const user = req.user;
  
      if (!user || !user.id) {
        return res.status(401).send('Unauthorized');
      }
      
      // Allow admin
      if (user.role === 'admin') return next();
  
      // Allow company that owns the ad
      if (user.role === 'company' && ad.companyId.toString() === user.id) return next();
  
      return res.status(403).send('Not authorized');
    } catch (err) {
      res.status(500).send('Server error');
    }
  };
  