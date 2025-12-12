const mongoose = require("mongoose");

// schema here
const contractorFormSchema = new mongoose.Schema(
  {
    project_id: {
      type: String,
      required: [true, "Project Id is required"],
    },
    rfi_no: {
      type: String,
      required: [true, "RFI No is required"],
    },
    date_of_rfi: {
      type: Date,
      required: [true, "Date of RFI is required"],
    },
    previously_requested: {
      type: String,
      enum: ["yes", "no"],
      required: [true, "Previously Requested is required"],
    },
    previous_rfi_no:{
      type:String,
    },
    date_of_inspection: {
      type: Date,
      required: [true, "Date of Inspection is required"],
    },
    time_of_inspection: {
      type: String,
      required: [true, "Time of Inspection is required"],
    },
    type_of_activity: {
      type: String,
      required: [true, "Type of Activity is Required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    bill_no: {
      type: String,
      required: [true, "Bill No is required"],
    },
    boq_item_no: {
      type: String,
      required: [true, "BOQ Item No is required"],
    },
    drawing_ref_no: {
      type: String,
      required: [true, "Drawing Ref No is required"],
    },
    contractor_status: {
      type: String,
      enum: ["pending", "received", "approved", "rejected", "expired", "revert"],
      default: "pending",
    },
    contractor_submit_date: {
      type: String,
      // required: false,
    },
    contractor_submit_time: {
      type: String,
      // required: false,
    },
    // Contractor fields
    selected_inspector:{
      type:String,
    },
    selected_surveyor:{
      type:String,
    },
    selected_me:{
      type:String,
    },
    selected_are:{
      type:String,
    },
    selected_re:{
      type:String,
    },
    contractor_name: {
      type: String,
      //  required: true,
    },
    // Consultant fields
    consultant_name: {
      type: String,
      // required: true,
    },
    consultant_status: {
      type: String,
      enum: [
        "received_from_contractor",
        "pending",
        "send_to_contractor",
        "received_from_re",
        "expired",
        'revert',
      ],
      default: "pending",
    },
    consultant_remarks:{
      type:String,
    },
    consultant_update_date: {
      type: String,
      // required: false,
    },
    consultant_update_time: {
      type: String,
      // required: false,
    },
    
    // Inspector fields
    inspector_name: {
      type: String,
      //  required: true,
    },
    inspector_remarks: {
      type: String,
      // required: false,
    },
    inspector_status: {
      type: String,
      enum: ["okay","pending", "not_okay", "expired"],
      // required: false,
    },
    inspector_update_date: {
      type: String,
      // required: false,
    },
    inspector_update_time: {
      type: String,
      // required: false,
    },
    // Surveyor fields
    surveyor_name: {
      type: String,
      //  required: true,
    },
    surveyor_remarks: {
      type: String,
      // required: false,
    },
    surveyor_status: {
      type: String,
      enum: ["okay","pending", "not_okay", "expired"],
      // required: false,
    },
    surveyor_update_date: {
      type: String,
      // required: false,
    },
    surveyor_update_time: {
      type: String,
      // required: false,
    },

    // ME fields
    me_name: {
      type: String,
      //  required: true,
    },
    me_remarks: {
      type: String,
      //  required: false,
    },
    me_status: {
      type: String,
      enum: ["okay","pending", "not_okay", "expired"],
      //  required: false,
    },
    me_update_date: {
      type: String,
      //  required: false,
    },
    me_update_time: {
      type: String,
      // required: false,
    },

    // ARE fields
    are_name: {
      type: String,
      //   required: true,
    },
    are_remarks: {
      type: String,
      required: false,
    },
    are_status: {
      type: String,
      enum: ["okay","pending", "not_okay", "expired"],
      required: false,
    },
    are_update_date: {
      type: String,
      required: false,
    },
    are_update_time: {
      type: String,
      required: false,
    },

    // RE fields
    re_name: {
      type: String,
      // required: true,
    },
    re_remarks: {
      type: String,
      required: false,
    },
    re_status: {
      type: String,
     enum: ["okay","pending", "not_okay", "expired"],
      required: false,
    },
    re_update_date: {
      type: String,
      required: false,
    },
    re_update_time: {
      type: String,
      required: false,
    },
    cons_stat_status:{
      type:String,
      enum:["pending","send_to_contractor","received_from_re","expired"],
    },
    cons_stat_name:{
      type:String,
    },
    cons_stat_date:{
      type:String,
    },
    cons_stat_time:{
      type:String,
    },
    cont_rec_status:{
      type:String,
      enum:["pending","received","approved","rejected","expired"],
    },
    cont_rec_name:{
      type:String,
    },
    cont_rec_date:{
      type:String,
    },
    cont_rec_time:{
      type:String,
    },
  },
  {
    timestamps: true,
  }
); //  schema end
// Pre-save hook to convert timestamps to Pakistan Standard Time (UTC+5)
contractorFormSchema.pre("save", function (next) {
  const offsetMs = 5 * 60 * 60 * 1000; // PKT offset in milliseconds
  if (this.createdAt) {
    this.createdAt = new Date(this.createdAt.getTime() + offsetMs);
  }
  if (this.updatedAt) {
    this.updatedAt = new Date(this.updatedAt.getTime() + offsetMs);
  }
  next();
});
// model here
const ContractorForm = mongoose.model("ContractorForm", contractorFormSchema);

module.exports = ContractorForm;
