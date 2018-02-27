var mongoose = require("mongoose");

var AgendaSchema = new mongoose.Schema({
    date: Date,
    isactive: { type: Boolean, default: true }
});
module.exports = mongoose.model("Agenda", AgendaSchema);
