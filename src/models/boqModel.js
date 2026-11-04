
const mongoose = require("mongoose");

// Line item checklist schema
const lineItemCheckListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

// Line item schema
const lineItemSchema = new mongoose.Schema(
  {
    line_item_name: {
      type: String,
      trim: true,
      required: true,
    //  unique:true,
    },
    line_item_type:{
      type:String,
      enum:["boq","non-boq"],
      default:"boq",
    },
    line_item_checklist: [lineItemCheckListSchema],
  },
  { _id: false }
);

// Main BOQ schema
const boqSchema = new mongoose.Schema({
  project: {
    type: String,
    trim: true,
    required: true,
    unique:true,
  },
  line_item: [lineItemSchema],
});

// Model
const Boq = mongoose.model("Boq", boqSchema);

module.exports = Boq;
