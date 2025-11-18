const mongoose=require('mongoose');

// schema here
const contractorFormSchema=new mongoose.Schema({
    project_name: {
        type: String,
        required: true,
    },
    rfi_no: {
        type: String,
        required: true,
    },
    date_of_rfi: {
        type: Date,
        required: true,
    },
    previously_requested: {
        type: String,
        enum: ['yes', 'no'],
        required: true,
    },
    previous_rfi_no: {
        type: String,
        required: false,
    },
    date_of_inspection: {
        type: Date,
        required: true,
    },
    time_of_inspection: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    type_of_activity: {
        type: String,
        required: true,
    },
    bill_no:{
        type: String,
        required:true,
    },
    boq_item_no: {
        type: String,
        required: true,
    },
    drawing_ref_no: {
        type: String,
        required: true,
    },
    
    // Contractor fields
    contractor_name: {
        type: String,
      //  required: true,
    },
    contractor_status: {
        type: String,
        enum: ['send', 'received', 'empty'],
        default: 'empty',
    },
    contractor_submit_date: {
        type: Date,
       // required: false,
    },
    contractor_submit_time: {
        type: String,
       // required: false,
    },
    
    // Consultant fields
    consultant_name: {
        type: String,
       // required: true,
    },
    consultant_status: {
        type: String,
        enum: ['receivedfromcontractor', 'pending','sendedtocontractor','receivedfromre'],
        default: 'pending',
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
        enum: ['okay', 'not_okay'],
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
        enum: ['okay', 'not_okay'],
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
        enum: ['okay', 'not_okay'],
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
        enum: ['approved', 'not_approved'],
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
}, {
    timestamps: true,
});

// model here
const ContractorForm=mongoose.model("ContractorForm",contractorFormSchema);

module.exports=ContractorForm;