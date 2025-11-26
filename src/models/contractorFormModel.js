const mongoose=require('mongoose');

// schema here
const contractorFormSchema=new mongoose.Schema({
   project_id: {
  type: String,
  required: [true, "project_id is required"],
},
rfi_no: {
  type: String,
  required: [true, "rfi_no is required"],
},
date_of_rfi: {
  type: Date,
  required: [true, "date_of_rfi is required"],
},
previously_requested: {
  type: String,
  enum: ['yes', 'no'],
  required: [true, "previously_requested is required"],
},
date_of_inspection: {
  type: Date,
  required: [true, "date_of_inspection is required"],
},
time_of_inspection: {
  type: String,
  required: [true, "time_of_inspection is required"],
},
location: {
  type: String,
  required: [true, "location is required"],
},
bill_no: {
  type: String,
  required: [true, "bill_no is required"],
},
boq_item_no: {
  type: String,
  required: [true, "boq_item_no is required"],
},
drawing_ref_no: {
  type: String,
  required: [true, "drawing_ref_no is required"],
},
    
    // Contractor fields
    contractor_name: {
        type: String,
      //  required: true,
    },
    contractor_status: {
        type: String,
        enum: ['pending', 'received', 'approved','rejected','expired'],
        default: 'pending',
    },
    contractor_submit_date: {
        type: String,
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
        enum: ['received_from_contractor', 'pending','send_to_contractor','received_from_re','expired'],
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
        enum: ['okay', 'not_okay','expired'],
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
        enum: ['okay', 'not_okay','expired'],
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
        enum: ['okay', 'not_okay','expired'],
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
        enum: ['okay', 'not_okay','expired'],
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
        enum: ['approved', 'not_approved','expired'],
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
    // status:{
    //     type:String,
    //     enum:['expired','in_progress'],
    //     default:'',
    // }
}, {
    timestamps: true,
}); //  schema end
// Pre-save hook to convert timestamps to Pakistan Standard Time (UTC+5)
contractorFormSchema.pre('save', function(next) {
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
const ContractorForm=mongoose.model("ContractorForm",contractorFormSchema);

module.exports=ContractorForm;