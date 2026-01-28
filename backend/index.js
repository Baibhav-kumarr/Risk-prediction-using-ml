import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import axios from "axios";


const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "https://risk-prediction-using-ml-2final.onrender.com"
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

const ML_API = process.env.ML_API || "http://127.0.0.1:8000/predict";

app.post("/predict", async (req, res) => {
  try {
    const response = await axios.post(ML_API, req.body);
    res.json(response.data);
 } catch (err) {
  console.error(err.message);
  res.status(500).json({ error: "ML service not responding" });
}

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

