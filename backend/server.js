require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const propertyRoutes = require("./routes/propertyRoutes");
const bookingRoutes  = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅  MongoDB Connected"))
    .catch(err => console.error("❌  MongoDB connection error:", err));

app.use("/api/properties", propertyRoutes);
app.use("/api/bookings",   bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀  Server running on port ${PORT}`);
});