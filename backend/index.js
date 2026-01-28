import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json());

// ENV values
const PORT = process.env.PORT || 5000;
const ML_API = process.env.ML_API;

// Routes
app.post("/predict", async (req, res) => {
  try {
    const response = await axios.post(ML_API, req.body);
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "ML service not responding" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
