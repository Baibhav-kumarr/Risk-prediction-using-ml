import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
// 🔥 MUST be added to handle preflight
app.options("/*", cors());
app.use(express.json());


const ML_API = process.env.ML_API;

app.post("/predict", async (req, res) => {
  try {
const response = await axios.post(`${ML_API}/predict`, req.body);

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "ML service not responding" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
