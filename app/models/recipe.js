var mongoose = require('mongoose');
var RecipeSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true }, // Kelsey: made unique names a requirement
    postedBy: String,
    ingredients: [String], // changed by kelsey
    direction: String // changed by kelsey - should this be an array or single value?
});

// return the model
module.exports = mongoose.model('Recipe', RecipeSchema);
