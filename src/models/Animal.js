const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 2,
        required: [true, "Name is required!"],
    },
    years: {
        type: Number,
        minLength: 1,
        maxLength: 100,
        required: [true, "Number is required!"],
    },
    kind: {
        type: String,
        minLength: 3,
        required: [true, "Kind is required!"],
    },
    image: {
        type: String,
        match: /^https?:\/\//,
        required: [true, "Image is required!"],
    },
    need: {
        type: String,
        minLength: 3,
        maxLength: 20,
        required: [true, "Need is required!"],
    },
    location: {
        type: String,
        minLength: 5,
        maxLength: 15,
        required: [true, "Location is required!"],
    },
    description: {
        type: String,
        minLength: 5,
        maxLength: 50,
        required: [true, "Description is required!"],
    },

    donations: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
        unique: true,
    }],

    createdAt: {
        type: Date,
        default: Date.now,
    },

    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }
});

const Animal = mongoose.model("Animal", animalSchema);
module.exports = Animal;	

