const mongoose = require('mongoose');

// schema here
const clientScheam = new mongoose.Schema({
    client_name: {
      type:String,
        required:true,
    },
    client_logo: {
        type: String,
        required: true,
    },
});

// model here
const Client = mongoose.model("Client", clientScheam);
module.exports = Client;
