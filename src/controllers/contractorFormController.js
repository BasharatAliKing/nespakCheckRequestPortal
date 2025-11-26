const express = require("express");
const ContractorForm = require("../models/contractorFormModel");
const cron = require("node-cron");
// After 24 Hourse By default when submitted Contractor Status Will be Changed if any empty
cron.schedule("* * * * *", async () => {
    const now = new Date();
    const hours24 = 24 * 60 * 60 * 1000;
   // const hours24 = 1 * 60 * 1000;

    // Status fields to check
    const pendingStatuses = [
        "pending",
        "", // empty if needed
    ];
    const forms = await ContractorForm.find({
        $or: [
            { contractor_status: { $in: pendingStatuses } },
            { consultant_status: { $in: pendingStatuses } },
            { inspector_status: { $in: pendingStatuses } },
            { surveyor_status: { $in: pendingStatuses } },
            { me_status: { $in: pendingStatuses } },
            { are_status: { $in: pendingStatuses } },
            { re_status: { $in: pendingStatuses } },
        ],
        createdAt: { $lte: new Date(now - hours24) }
    });

    for (let form of forms) {
        form.contractor_status = "expired"; // change status
        // form.consultant_status="expired",
        // form.inspector_status="expired",
        // form.surveyor_status="expired",
        // form.me_status="expired",
        // form.are_status="expired",
        // form.re_status="expired",
        await form.save();
    }
   // console.log("24-hour expiration job executed");
});
// get Contractor KPIs
const getContractorkpis = async (req, res) => {
  try {
    const contractorForms = await ContractorForm.find();
    // Get unique contractor names
    const uniqueNames = [
      ...new Set(
        contractorForms
          .map((form) => form.contractor_name)
          .filter((name) => name)
      ),
    ];
    // Calculate statistics
    const total_length = contractorForms.length;
     const total_request = contractorForms.filter((form) =>
      ["pending", "received", "approved", "rejected", "expired"].includes(
        form.contractor_status
      )
    ).length;
    const pending_request = contractorForms.filter(
      (form)=>form.contractor_status ==='pending'
    ).length;
    const received_request = contractorForms.filter(
      (form) => form.contractor_status === "received"
    ).length;
    const approved = contractorForms.filter(
      (form) => form.contractor_status === "approved"
    ).length;
    const not_approved = contractorForms.filter(
      (form) => form.contractor_status === "rejected"
    ).length;
    const expired = contractorForms.filter(
      (form) => form.contractor_status === "expired"
    ).length;

    const consultant_pending = contractorForms.filter(
        (form) => form.consultant_status === "pending"
    ).length;
    const consultant_received_from_contractor = contractorForms.filter(
        (form) => form.consultant_status === "received_from_contractor"
    ).length;
    const consultant_send_to_contractor = contractorForms.filter(
        (form) => form.consultant_status === "send_to_contractor"
    ).length;
    const consultant_received_from_re = contractorForms.filter(
        (form) => form.consultant_status === "received_from_re"
    ).length;
    const inspector_okay = contractorForms.filter(
        (form) => form.inspector_status === "okay"
    ).length;
    const inspector_not_okay = contractorForms.filter(
        (form) => form.inspector_status === "not_okay"
    ).length;
    const inspector_pending = contractorForms.filter(
        (form) => !form.inspector_status
    ).length;
    const inspector_total = inspector_okay + inspector_not_okay + inspector_pending;
    const surveyor_okay = contractorForms.filter(
        (form) => form.surveyor_status === "okay"
    ).length;
    const surveyor_not_okay = contractorForms.filter(
        (form) => form.surveyor_status === "not_okay"
    ).length;
    const surveyor_pending = contractorForms.filter(
        (form) => !form.surveyor_status
    ).length;
    const surveyor_total = surveyor_okay + surveyor_not_okay + surveyor_pending;
    const me_okay = contractorForms.filter(
        (form) => form.me_status === "okay"
    ).length;
    const me_not_okay = contractorForms.filter(
        (form) => form.me_status === "not_okay"
    ).length;
    const me_pending = contractorForms.filter(
        (form) => !form.me_status
    ).length;
    const me_total = me_okay + me_not_okay + me_pending;
    const are_okay = contractorForms.filter(
        (form) => form.are_status === "okay"
    ).length;
    const are_not_okay = contractorForms.filter(
        (form) => form.are_status === "not_okay"
    ).length;
    const are_pending = contractorForms.filter(
        (form) => !form.are_status
    ).length;
    const are_total = are_okay + are_not_okay + are_pending;
    const re_approved = contractorForms.filter(
        (form) => form.re_status === "approved"
    ).length;
    const re_not_approved = contractorForms.filter(
        (form) => form.re_status === "not_approved"
    ).length;
    const re_pending = contractorForms.filter(
        (form) => !form.re_status
    ).length;
    const re_total = re_approved + re_not_approved + re_pending;

    //enum: ['received_from_contractor', 'pending','send_to_contractor','received_from_re'],
    const kpiData = {
      total_length,
      constractor: {
        total_request,
        received_request,
        pending_request,
        approved,
        not_approved,
        expired,
      },
         consultant: {
        consultant_pending,
        consultant_received_from_contractor,
        consultant_send_to_contractor,
        consultant_received_from_re,
        },
      inspector: {
        inspector_total,
        inspector_okay,
        inspector_not_okay,
        inspector_pending,
      },
        surveyor: {
        surveyor_total,
        surveyor_okay,
        surveyor_not_okay,
        surveyor_pending,
        },
        me: {
        me_total,
        me_okay,
        me_not_okay,
        me_pending,
        },
        are: {
        are_total,
        are_okay,
        are_not_okay,
        are_pending,
        },
        re: {
        re_total,
        re_approved,
        re_not_approved,
        re_pending,
        },  
    };

    res
      .status(200)
      .json({ message: "Contractor KPIs Retrieved Successfully", kpiData });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error in Retrieving Contractor KPIs", err });
  }
};
// get Contractor KPIs by Project ID
const getContractorkpisByProject = async (req, res) => {
  try {
    // Get project_id from query parameters (optional)
    const { id } = req.params;
    // Build filter object

    const contractorForms = await ContractorForm.find({ project_id: id });
    console.log(contractorForms);
    // Get unique contractor names
    const uniqueNames = [
      ...new Set(
        contractorForms
          .map((form) => form.contractor_name)
          .filter((name) => name)
      ),
    ];
    // Calculate statistics
    const total_length = contractorForms.length;
    console.log(total_length);
    const total_request = contractorForms.filter((form) =>
      ["pending", "received", "approved", "rejected", "expired"].includes(
        form.contractor_status
      )
    ).length;
     const pending_request = contractorForms.filter(
      (form)=>form.contractor_status ==='pending'
    ).length;
    const received_request = contractorForms.filter(
      (form) => form.contractor_status === "received"
    ).length;
    const approved = contractorForms.filter(
      (form) => form.contractor_status === "approved"
    ).length;
    const not_approved = contractorForms.filter(
      (form) => form.contractor_status === "rejected"
    ).length;
    const expired = contractorForms.filter(
      (form) => form.contractor_status === "expired"
    ).length;
    const consultant_pending = contractorForms.filter(
        (form) => form.consultant_status === "pending"
    ).length;
    const consultant_received_from_contractor = contractorForms.filter(
        (form) => form.consultant_status === "received_from_contractor"
    ).length;
    const consultant_send_to_contractor = contractorForms.filter(
        (form) => form.consultant_status === "send_to_contractor"
    ).length;
    const consultant_received_from_re = contractorForms.filter(
        (form) => form.consultant_status === "received_from_re"
    ).length;
    const inspector_okay = contractorForms.filter(
        (form) => form.inspector_status === "okay"
    ).length;
    const inspector_not_okay = contractorForms.filter(
        (form) => form.inspector_status === "not_okay"
    ).length;
    const inspector_pending = contractorForms.filter(
        (form) => !form.inspector_status
    ).length;
    const inspector_total = inspector_okay + inspector_not_okay + inspector_pending;
    const surveyor_okay = contractorForms.filter(
        (form) => form.surveyor_status === "okay"
    ).length;
    const surveyor_not_okay = contractorForms.filter(
        (form) => form.surveyor_status === "not_okay"
    ).length;
    const surveyor_pending = contractorForms.filter(
        (form) => !form.surveyor_status
    ).length;
    const surveyor_total = surveyor_okay + surveyor_not_okay + surveyor_pending;
    const me_okay = contractorForms.filter(
        (form) => form.me_status === "okay"
    ).length;
    const me_not_okay = contractorForms.filter(
        (form) => form.me_status === "not_okay"
    ).length;
    const me_pending = contractorForms.filter(
        (form) => !form.me_status
    ).length;
    const me_total = me_okay + me_not_okay + me_pending;
    const are_okay = contractorForms.filter(
        (form) => form.are_status === "okay"
    ).length;
    const are_not_okay = contractorForms.filter(
        (form) => form.are_status === "not_okay"
    ).length;
    const are_pending = contractorForms.filter(
        (form) => !form.are_status
    ).length;
    const are_total = are_okay + are_not_okay + are_pending;
    const re_approved = contractorForms.filter(
        (form) => form.re_status === "approved"
    ).length;
    const re_not_approved = contractorForms.filter(
        (form) => form.re_status === "not_approved"
    ).length;
    const re_pending = contractorForms.filter(
        (form) => !form.re_status
    ).length;
    const re_total = re_approved + re_not_approved + re_pending;

    //enum: ['received_from_contractor', 'pending','send_to_contractor','received_from_re'],
    const kpiData = {
      total_length,
      constractor: {
        total_request,
        received_request,
        pending_request,
        approved,
        not_approved,
        expired,
      },
         consultant: {
        consultant_pending,
        consultant_received_from_contractor,
        consultant_send_to_contractor,
        consultant_received_from_re,
        },
      inspector: {
        inspector_total,
        inspector_okay,
        inspector_not_okay,
        inspector_pending,
      },
        surveyor: {
        surveyor_total,
        surveyor_okay,
        surveyor_not_okay,
        surveyor_pending,
        },
        me: {
        me_total,
        me_okay,
        me_not_okay,
        me_pending,
        },
        are: {
        are_total,
        are_okay,
        are_not_okay,
        are_pending,
        },
        re: {
        re_total,
        re_approved,
        re_not_approved,
        re_pending,
        },  
    };
    
    res
      .status(200)
      .json({ message: "Contractor KPIs Retrieved Successfully", kpiData });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error in Retrieving Contractor KPIs", err });
  }
};
// get List By get Status
const getContractorFormsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const contractorForms = await ContractorForm.find({
      contractor_status: status,
    });
    res.status(200).json({
      message: "Contractor Forms Retrieved Successfully",
      data:contractorForms,
    });
  } catch (err) {
    res.status(400).json({ message: "Error in Retrieving Contractor Forms", err });
  }
};
// get list by projectId and status
const getContractorFormsByProjectAndStatus = async (req, res) => {
  try {
    const { projectId, status } = req.params;
    const contractorForms = await ContractorForm.find({
      project_id: projectId,
      contractor_status: status,
    });
    res.status(200).json({
      message: "Contractor Forms Retrieved Successfully",
      data:contractorForms,
    });
  } catch (err) {
    res.status(400).json({ message: "Error in Retrieving Contractor Forms", err });
  }
};
// get list status of consultant by status
const createContractorForm = async (req, res) => {
  try {
    const contractorForm = req.body;

    if (!contractorForm.contractor_status || contractorForm.contractor_status.trim() === "") {
      contractorForm.contractor_status = "pending";   // default
    }

    const newContractorForm = new ContractorForm(contractorForm);
    await newContractorForm.save();

    return res.status(201).json({
      message: "Contractor Form Created Successfully",
      newContractorForm,
    });

} catch (err) {
  if (err.name === "ValidationError") {
    const firstError = Object.values(err.errors)[0].message;  // get only first error
    return res.status(400).json({ message: firstError });
  }

  res.status(400).json({ message: "Error in Creating Contractor Form" });
}
};
const getContractorForms = async (req, res) => {
  try {
    const contractorForms = await ContractorForm.find();
    res
      .status(200)
      .json({
        message: "Contractor Forms Retrieved Successfully",
        contractorForms,
      });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error in Retrieving Contractor Forms", err });
  }
};

const getContractorFormById = async (req, res) => {
  try {
    const contractorFormId = req.params.id;
    const contractorForm = await ContractorForm.findById(contractorFormId);

    if (!contractorForm) {
      return res.status(404).json({ message: "Contractor Form not found" });
    }

    res
      .status(200)
      .json({
        message: "Contractor Form Retrieved Successfully",
        contractorForm,
      });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error in Retrieving Contractor Form", err });
  }
};

const updateContractorForm = async (req, res) => {
  try {
    const contractorFormId = req.params.id;
    const updatedData = req.body;

    const updatedContractorForm = await ContractorForm.findByIdAndUpdate(
      contractorFormId,
      updatedData,
      { new: true }
    );

    if (!updatedContractorForm) {
      return res.status(404).json({ message: "Contractor Form not found" });
    }

    res
      .status(200)
      .json({
        message: "Contractor Form Updated Successfully",
        updatedContractorForm,
      });
  } catch (err) {
    res.status(400).json({ message: "Error in Updating Contractor Form", err });
  }
};

const deleteContractorForm = async (req, res) => {
  try {
    const contractorFormId = req.params.id;
    const deletedContractorForm = await ContractorForm.findByIdAndDelete(
      contractorFormId
    );

    if (!deletedContractorForm) {
      return res.status(404).json({ message: "Contractor Form not found" });
    }

    res.status(200).json({ message: "Contractor Form Deleted Successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error in Deleting Contractor Form", err });
  }
};

module.exports = {
  getContractorkpis,
  getContractorkpisByProject,
  getContractorFormsByStatus,
  getContractorFormsByProjectAndStatus,
  createContractorForm,
  getContractorForms,
  getContractorFormById,
  updateContractorForm,
  deleteContractorForm,
};
