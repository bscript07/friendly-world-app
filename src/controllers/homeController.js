const router = require("express").Router();

const Animal = require("../models/Animal");
const animalsService = require("../services/animalsService");

router.get("/", async (req, res) => { 
    const latestAnimals = await animalsService.getLatest().lean();

    res.render("home", { latestAnimals });
});

router.get("/search", async (req, res) => {
    const location = req.query.location || "";
    const animals = await Animal.find({ location: { $regex: location, $options: "i" },}).lean();

    res.render("search", { animals });
});

module.exports = router;