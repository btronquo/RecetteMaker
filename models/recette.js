/**
 *
 *  @author: Boris Tronquoy
 *  @description: Modèle pour la partie recette
 *
*/

var mongoose = require("mongoose");

var RecetteSchema = new mongoose.Schema({
    name: String,
    datecre: Date.now,
    comments: String,
    status: Boolean,
});
module.exports = mongoose.model("Recette", RecetteSchema);
