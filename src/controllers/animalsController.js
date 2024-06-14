const router = require("express").Router();

const { isAuth } = require("../middleware/authMiddleware");
const { getErrorMessage } = require("../utils/errorUtils");

const Animal = require("../models/Animal");
const animalsService = require('../services/animalsService');
router.get("/", async (req, res) => {
    const animals = await animalsService.getAll().lean();

    res.render("animals/catalog", { animals });
});

router.get("/:animalId/details", async (req, res) => {
    const animalId = req.params.animalId;
    const userId = req.user?._id;

    const animal = await animalsService.getOneDetailed(animalId, userId);
    const isOwner = animal.owner && animal.owner._id.equals(req.user?._id);

    res.render("animals/details", { ...animal, isOwner });
});

router.get("/:animalId/donate-handler", async (req, res) => {
    const animalId = req.params.animalId;
    const userId = req.user?._id;
    
    const animal = await Animal.findById(animalId);

    animal.donations.push(userId);
    await animal.save();

    res.redirect(`/animals/${animalId}/details`);
});

router.get("/create", isAuth, (req, res) => {
    res.render("animals/create");
});

router.post("/create", isAuth, async (req, res) => {
    const animalData = req.body;

    try {
        await animalsService.create(req.user._id, animalData);

        res.redirect("/animals");
    } catch (err) {
        res.render("animals/create", { ...animalData, error: getErrorMessage(err) });
    }
});

router.get("/:animalId/edit", isAnimalOwner, async (req, res) => {
    res.render("animals/edit", { ...req.animal });
});

router.post("/:animalId/edit", isAnimalOwner, async (req, res) => {

    const animalData = req.body;

    try {
        await animalsService.edit(req.params.animalId, animalData);

        res.redirect(`/animals/${req.params.animalId}/details`);
    } catch (err) {
        res.render("animals/edit", { ...animalData, error: getErrorMessage(err)});
    }
});

router.get("/:animalId/delete", isAnimalOwner, async (req, res) => {
    
    await animalsService.delete(req.params.animalId);

    res.redirect("/animals");
});

async function isAnimalOwner(req, res, next) {
    const animal = await animalsService.getOne(req.params.animalId).lean();

    if (animal.owner != req.user?._id) {
        return res.redirect(`/animals/${req.params.animalId}/details`);
    }

    req.animal = animal;
    next();
} 

module.exports = router;