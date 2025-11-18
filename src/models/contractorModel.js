const mongoose = require('mongoose');

// schema here
const contractorSchema = new mongoose.Schema({
    contractor_name: {
        type: String,
        required: true,
    },
    contractor_logo: {
        type: String,
        required: true,
    },
});

// model here
const Contractor = mongoose.model("Contractor", contractorSchema);
module.exports = Contractor;
