/**
 * 
 *  @author: Boris Tronquoy
 *  @description: Modèle pour la partie recette
 *  
*/

var mongoose = require("mongoose");

var RecetteSchema = new mongoose.Schema({
    name: String,
    datecre: String,
    status: String,
    createdby: String,
    birthdate: String,
    email: String
});
module.exports = mongoose.model("Recette", RecetteSchema);
