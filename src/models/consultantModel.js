const mongoose = require('mongoose');

// schema here
const consultantSchema = new mongoose.Schema({
    consultant_name: {
        type: String,
        required: true,
    },
    consultant_logo: {
        type: String,
        required: true,
    },
});

// model here
const Consultant = mongoose.model("Consultant", consultantSchema);
module.exports = Consultant;
