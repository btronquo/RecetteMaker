/**
 *
 *  @author: Boris Tronquoy
 *  @description: Modèle pour les objects des recettes
 *
*/

var mongoose = require("mongoose");

var ObjectSchema = new mongoose.Schema({
    name: String,
    datecre: {type: Date, default: Date.now},
    comment: String
});
module.exports = mongoose.model("Object", ObjectSchema);
