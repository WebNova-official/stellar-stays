const router   = require("express").Router();
const Property = require("../models/Property");

// Get all properties
router.get("/", async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single property
router.get("/:id", async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "Property not found" });
        res.json(property);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add property
router.post("/", async (req, res) => {
    try {
        const body = { ...req.body };
        // backfill weekendRate → pricePerNight if not provided
        if (!body.weekendRate && body.pricePerNight) {
            body.weekendRate = body.pricePerNight;
        }
        console.log("[POST /properties] pricePerNight:", body.pricePerNight, "weekendRate:", body.weekendRate);
        const property = new Property(body);
        await property.save();
        console.log("[POST /properties] saved weekendRate:", property.weekendRate);
        res.status(201).json(property);
    } catch (err) {
        console.error("[POST /properties] error:", err.message);
        res.status(400).json({ message: err.message });
    }
});

// ── PATCH /api/properties/:id/blocked-dates — must be BEFORE /:id PUT ──
router.patch("/:id/blocked-dates", async (req, res) => {
    try {
        const { blockedDates } = req.body;
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { blockedDates: blockedDates || [] },
            { new: true }
        );
        if (!property) return res.status(404).json({ message: "Property not found" });
        res.json({ success: true, blockedDates: property.blockedDates });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update property (full) — preserve blockedDates if not sent
router.put("/:id", async (req, res) => {
    try {
        const update = { ...req.body };
        // backfill weekendRate → pricePerNight if not provided
        if (!update.weekendRate && update.pricePerNight) {
            update.weekendRate = update.pricePerNight;
        }
        // Don't wipe blockedDates if admin didn't send them
        if (!update.blockedDates) delete update.blockedDates;
        console.log("[PUT /properties/:id] pricePerNight:", update.pricePerNight, "weekendRate:", update.weekendRate);
        const property = await Property.findByIdAndUpdate(
            req.params.id, update, { new: true, runValidators: true }
        );
        if (!property) return res.status(404).json({ message: "Property not found" });
        console.log("[PUT /properties/:id] saved weekendRate:", property.weekendRate);
        res.json(property);
    } catch (err) {
        console.error("[PUT /properties/:id] error:", err.message);
        res.status(400).json({ message: err.message });
    }
});

// Delete property
router.delete("/:id", async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) return res.status(404).json({ message: "Property not found" });
        res.json({ message: "Property deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;