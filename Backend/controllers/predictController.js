import Report from '../models/predictModel.js'
import Sales from "../models/salesModel.js";
import Product from "../models/productModel.js";
import axios from "axios";
    
export async function adminPredict(req, res) {
  try {
    const inputData = req.body;

    if (inputData.date) {
      const [monthName, yearStr] = inputData.date.split(" ");
      const monthMap = {
        January: 1, February: 2, March: 3, April: 4, May: 5,
        June: 6, July: 7, August: 8, September: 9,
        October: 10, November: 11, December: 12,
      };
      inputData.month = monthMap[monthName];
      inputData.year = parseInt(yearStr);
    }

    const product = await Product.findOne({ name: inputData.name });
    if (!product) {
      return res.status(404).json({ message: "This product does not exist" });
    }

    const predictions = [];

    for (let month = inputData.month; month >= 1; month--) {
      const existingReport = await Report.findOne({
        name: inputData.name,
        brand: product.brand,
        discount: product.discount,
        price: product.price,
        month,
        year: inputData.year,
        created_by: req.user.id,
      });

      if (existingReport) {
        predictions.push({ month, prediction: existingReport.prediction, status: "exists" });
        continue;
      }

      const payload = {
        name: inputData.name,
        brand: product.brand,
        price: product.price,
        discount: product.discount,
        month,
        year: inputData.year
      };

      const response = await axios.post("http://127.0.0.1:8000/", payload);
      const prediction = response.data.prediction;

      const report = new Report({
        ...payload,
        prediction,
        created_by: req.user.id,
      });
      await report.save();

      predictions.push({ month, prediction, status: "new" });
    }

    // Fetch actual sales values once
    const actual_values = await Sales.find({
      product_name: inputData.name,
      month: inputData.month,
    })
      .sort({ year: 1 })
      .select("product_name month year quantity_sold -_id");

    return res.json({
      product_name: inputData.name,
      predictions,
      actual_values,
      created_by: { role: req.user.role },
      message: "Predictions generated for this and previous months",
    });

  } catch (error) {
    console.error("Admin Prediction error:", error.message);
    res.status(500).json({ error: "Prediction service failed." });
  }
}


// ====================== COMPANY ======================
export async function companyPredict(req, res) {
  try {
    const inputData = req.body;

    if (inputData.date) {
      const [monthName, yearStr] = inputData.date.split(" ");
      const monthMap = {
        January: 1, February: 2, March: 3, April: 4, May: 5,
        June: 6, July: 7, August: 8, September: 9,
        October: 10, November: 11, December: 12,
      };
      inputData.month = monthMap[monthName];
      inputData.year = parseInt(yearStr);
    }

    const product = await Product.findOne({ name: inputData.name });
    if (!product) return res.status(404).json({ message: "This product does not exist" });

    if (!product.companyId || String(product.companyId) !== String(req.user.companyId)) {
      return res.status(403).json({ message: "Not authorized to predict for this product" });
    }

    const predictions = [];

    for (let m = 1; m <= inputData.month; m++) {
      const payload = {
        name: inputData.name,
        brand: product.brand,
        price: product.price,
        discount: product.discount,
        month: m,
        year: inputData.year,
      };

      const response = await axios.post("http://127.0.0.1:8000/", payload);
      const prediction = response.data.prediction;

      predictions.push({ month: m, prediction });

      if (m === inputData.month) {
        const report = new Report({
          ...payload,
          prediction,
          created_by: req.user.id,
        });
        await report.save();
      }
    }

    const actual_values = await Sales.find({
      product_name: inputData.name,
      month: inputData.month,
    })
      .sort({ year: 1 })
      .select("product_name month year quantity_sold -_id");

    return res.json({
      created_by: { role: req.user.role },
      predictions,
      actual_values,
      message: "Predictions completed",
    });

  } catch (error) {
    console.error("Company Prediction error:", error.message);
    res.status(500).json({ error: "Prediction service failed." });
  }
}
