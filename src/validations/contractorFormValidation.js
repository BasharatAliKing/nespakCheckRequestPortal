const { z } = require("zod");

const contractorFormSchema = z.object({
    project_id: z.string({ required_error: "Project ID is required" }).min(1, "Project ID is required"),
    rfi_no: z.string({ required_error: "RFI number is required" }).min(1, "RFI number is required"),

    date_of_rfi: z.string({ required_error: "Date of RFI is required" }).refine(
        v => !isNaN(Date.parse(v)),
        "Invalid date for date_of_rfi"
    ),

    previously_requested: z.enum(["yes", "no"], {
        required_error: "previously_requested is required"
    }),

    previous_rfi_no: z.string().optional(),

    date_of_inspection: z.string({ required_error: "Date of inspection is required" }).refine(
        v => !isNaN(Date.parse(v)),
        "Invalid date for date_of_inspection"
    ),

    time_of_inspection: z.string({ required_error: "Time of inspection is required" }).min(1, "Time of inspection is required"),
    location: z.string({ required_error: "Location is required" }).min(1, "Location is required"),
    type_of_activity: z.string({ required_error: "Type of activity is required" }).min(1, "Type of activity is required"),
    bill_no: z.string({ required_error: "Bill number is required" }).min(1, "Bill number is required"),
    boq_item_no: z.string({ required_error: "BOQ Item number is required" }).min(1, "BOQ Item number is required"),
    drawing_ref_no: z.string({ required_error: "Drawing reference number is required" }).min(1, "Drawing reference number is required"),
});

module.exports = contractorFormSchema;
