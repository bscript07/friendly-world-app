const Animal = require("../models/Animal");
const User = require("../models/User");

exports.getAll = () => Animal.find();
exports.getOne = (animalId) => Animal.findById(animalId).populate();

exports.getLatest = () => Animal.find().sort({ createdAt: -1 }).limit(3);
exports.getOneDetailed = async (animalId, userId) => {
   const animal = await Animal.findById(animalId)
   .populate("owner")
   .populate("donations")
   .lean();

   const isDonated = animal.donations.some(donation => donation._id.equals(userId));
   
   return {...animal, isDonated };
}
exports.create = async (userId, animalData) => {
   const createdAnimal = await Animal.create({ owner: userId, ...animalData });

   await User.findByIdAndUpdate(userId, { $push: { createdItems: createdAnimal._id}});

   return createdAnimal;
};

exports.delete = (animalId) => Animal.findByIdAndDelete(animalId);
exports.edit = (animalId, animalData) => Animal.findByIdAndUpdate(animalId, animalData, { runValidators: true});