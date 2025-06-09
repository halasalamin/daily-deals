import cron from "node-cron";
import adsModel from "../models/adsModel.js";

// Schedule the job to run every 30 minute
cron.schedule("*/30 * * * *", async () => {
  // runs at minute 0 of every hour (e.g., 1:00, 2:00, 3:00, etc.)
  const now = new Date();

  try {
    const result = await adsModel.deleteMany({ endTime: { $lte: now, $ne: null } });
    console.log(`[${new Date().toISOString()}] Deleted ${result.deletedCount} expired ads.`);
  } catch (err) {
    console.error("Error deleting expired ads:", err.stack || err);
  }
}, {
  scheduled: true,
  timezone: "UTC" // optional
});
