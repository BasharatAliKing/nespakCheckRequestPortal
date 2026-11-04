const mongoose = require("mongoose");

// Line item checklist schema
const lineItemCheckListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["yes", "no", "n/a"],
      default: "n/a",
    },
    remarks: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { _id: false },
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
    line_item_checklist: [lineItemCheckListSchema],
  },
  { _id: false },
);

// Contractor BOQ schema
const contractorBoqSchema = new mongoose.Schema({
  project: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  checkRequestId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"ContractorForm",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  line_item: [lineItemSchema],
});

// model
const ncrpBoq = mongoose.model("ContractorBoq", contractorBoqSchema);

module.exports = ncrpBoq;
