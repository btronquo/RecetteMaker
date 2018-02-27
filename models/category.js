/**
 * 
 *  @author: Boris Tronquoy
 *  @description: Modèle pour les catégories des recettes
 *  
*/

var mongoose = require("mongoose");

var CategorySchema = new mongoose.Schema({
    name: String,
    datecre: String,
    status: String,
    createdby: String,
    birthdate: String,
    email: String
});
module.exports = mongoose.model("Category", CategorySchema);
