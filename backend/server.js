require("dotenv").config();

const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const path     = require("path");

const propertyRoutes = require("./routes/propertyRoutes");
const bookingRoutes  = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// ── Serve static frontend files from /public ──
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅  MongoDB Connected"))
    .catch(err => console.error("❌  MongoDB connection error:", err));

app.use("/api/properties", propertyRoutes);
app.use("/api/bookings",   bookingRoutes);

// ── Fallback: serve index.html for any unmatched route ──
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀  Server running on port ${PORT}`);
});
