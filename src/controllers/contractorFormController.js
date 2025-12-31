const express = require("express");
const ContractorForm = require("../models/contractorFormModel");
const cron = require("node-cron");
const Project = require("../models/projectModel");
// After 24 Hourse By default when submitted Contractor Status Will be Changed if any empty
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const hours24 = 24 * 60 * 60 * 1000;
  const pendingStatuses = ["pending"];
  // Fetch only forms where consultant has updated (accepted/processed)
  const forms = await ContractorForm.find({
    consultant_update_date: { $exists: true, $ne: "" },
    consultant_update_time: { $exists: true, $ne: "" },
    $or: [
      { inspector_status: { $in: pendingStatuses } },
      { surveyor_status: { $in: pendingStatuses } },
      { me_status: { $in: pendingStatuses } },
      { are_status: { $in: pendingStatuses } },
      { re_status: { $in: pendingStatuses } },
    ],
  });
  for (let form of forms) {
    // Convert your date + time fields into a real Date object
    const consultantUpdatedAt = new Date(
      `${form.consultant_update_date} ${form.consultant_update_time}`
    );
    // If parsing failed skip
    if (!consultantUpdatedAt || isNaN(consultantUpdatedAt)) continue;

    // Check if 24h has passed
    if (now - consultantUpdatedAt >= hours24) {
      if (pendingStatuses.includes(form.inspector_status)) {
        form.inspector_status = "expired";
      }
      if (pendingStatuses.includes(form.surveyor_status)) {
        form.surveyor_status = "expired";
      }
      if (pendingStatuses.includes(form.me_status)) {
        form.me_status = "expired";
      }
      if (pendingStatuses.includes(form.are_status)) {
        form.are_status = "expired";
      }
      if (pendingStatuses.includes(form.re_status)) {
        form.re_status = "expired";
      }
      await form.save();
    }
  }
});
// cron.schedule("* * * * *", async () => {
//     const now = new Date();

//     const hours24 = 24 * 60 * 60 * 1000;
//     const pendingStatuses = ["pending", ""];
//     const forms = await ContractorForm.find({
//         consultant_accept_time: { $lte: new Date(now - hours24) },
//         $or: [
//             { inspector_status: { $in: pendingStatuses } },
//             { surveyor_status: { $in: pendingStatuses } },
//             { me_status: { $in: pendingStatuses } },
//             { are_status: { $in: pendingStatuses } },
//             { re_status: { $in: pendingStatuses } },
//         ]
//     });
//     for (let form of forms) {
//         if (pendingStatuses.includes(form.inspector_status)) {
//             form.inspector_status = "expired";
//         }
//         if (pendingStatuses.includes(form.surveyor_status)) {
//             form.surveyor_status = "expired";
//         }
//         if (pendingStatuses.includes(form.me_status)) {
//             form.me_status = "expired";
//         }
//         if (pendingStatuses.includes(form.are_status)) {
//             form.are_status = "expired";
//         }
//         if (pendingStatuses.includes(form.re_status)) {
//             form.re_status = "expired";
//         }

//         await form.save();
//     }
// });

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
      [
        "pending",
        "received",
        "received_from_consultant",
        "approved",
        "rejected",
        "expired",
        "revert",
      ].includes(form.contractor_status)
    ).length;
    const received_from_consultant = contractorForms.filter(
      (form) => form.contractor_status === "received_from_consultant"
    ).length;
    const pending_request = contractorForms.filter(
      (form) => form.contractor_status === "pending"
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
    const revert = contractorForms.filter(
      (form) => form.contractor_status === "revert"
    ).length;
    const expired = contractorForms.filter(
      (form) => form.contractor_status === "expired"
    ).length;
    const consultant_total = contractorForms.filter((form) => {
      return [
        "received_from_contractor",
        "pending",
        "send_to_contractor",
        "received_from_re",
        "approved",
        "expired",
        "revert",
      ].includes(form.consultant_status);
    }).length;
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
    const consultant_approved = contractorForms.filter(
      (form) => form.consultant_status === "approved"
    ).length;
    const consultant_revert = contractorForms.filter(
      (form) => form.consultant_status === "revert"
    ).length;
    const consultant_expired = contractorForms.filter(
      (form) => form.consultant_status === "expired"
    ).length;
    const inspector_okay = contractorForms.filter(
      (form) => form.inspector_status === "okay"
    ).length;
    const inspector_not_okay = contractorForms.filter(
      (form) => form.inspector_status === "not_okay"
    ).length;
    const inspector_pending = contractorForms.filter(
      (form) => form.inspector_status === "pending"
    ).length;
    const inspector_expired = contractorForms.filter(
      (form) => form.inspector_status === "expired"
    ).length;
    const inspector_total =
      inspector_okay +
      inspector_not_okay +
      inspector_pending +
      inspector_expired;
    const surveyor_okay = contractorForms.filter(
      (form) => form.surveyor_status === "okay"
    ).length;
    const surveyor_not_okay = contractorForms.filter(
      (form) => form.surveyor_status === "not_okay"
    ).length;
    const surveyor_pending = contractorForms.filter(
      (form) => form.surveyor_status === "pending"
    ).length;
    const surveyor_expired = contractorForms.filter(
      (form) => form.surveyor_status === "expired"
    ).length;
    const surveyor_total =
      surveyor_okay + surveyor_not_okay + surveyor_pending + surveyor_expired;
    const me_okay = contractorForms.filter(
      (form) => form.me_status === "okay"
    ).length;
    const me_not_okay = contractorForms.filter(
      (form) => form.me_status === "not_okay"
    ).length;
    const me_pending = contractorForms.filter(
      (form) => form.me_status === "pending"
    ).length;
    const me_expired = contractorForms.filter(
      (form) => form.me_status === "expired"
    ).length;
    const me_total = me_okay + me_not_okay + me_pending + me_expired;
    const are_okay = contractorForms.filter(
      (form) => form.are_status === "okay"
    ).length;
    const are_not_okay = contractorForms.filter(
      (form) => form.are_status === "not_okay"
    ).length;
    const are_pending = contractorForms.filter(
      (form) => form.are_status === "pending"
    ).length;
    const are_expired = contractorForms.filter(
      (form) => form.are_status === "expired"
    ).length;
    const are_total = are_okay + are_not_okay + are_pending + are_expired;
    const re_approved = contractorForms.filter(
      (form) => form.re_status === "okay"
    ).length;
    const re_not_approved = contractorForms.filter(
      (form) => form.re_status === "not_okay"
    ).length;
    const re_pending = contractorForms.filter(
      (form) => form.re_status === "pending"
    ).length;
    const re_expired = contractorForms.filter(
      (form) => form.re_status === "expired"
    ).length;
    const re_total = re_approved + re_not_approved + re_pending + re_expired;
    //enum: ['received_from_contractor', 'pending','send_to_contractor','received_from_re'],
    const kpiData = {
      total_length,
      constractor: {
        total_request,
        received_request,
        received_from_consultant,
        pending_request,
        approved,
        not_approved,
        revert,
        expired,
      },
      consultant: {
        consultant_total,
        consultant_pending,
        consultant_received_from_contractor,
        consultant_send_to_contractor,
        consultant_received_from_re,
        consultant_revert,
        consultant_approved,
        consultant_expired,
      },
      inspector: {
        inspector_total,
        inspector_okay,
        inspector_not_okay,
        inspector_pending,
        inspector_expired,
      },
      surveyor: {
        surveyor_total,
        surveyor_okay,
        surveyor_not_okay,
        surveyor_pending,
        surveyor_expired,
      },
      me: {
        me_total,
        me_okay,
        me_not_okay,
        me_pending,
        me_expired,
      },
      are: {
        are_total,
        are_okay,
        are_not_okay,
        are_pending,
        are_expired,
      },
      re: {
        re_total,
        re_approved,
        re_not_approved,
        re_pending,
        re_expired,
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
// get contractor kpi by role and userId
const getContractorkpisByRoleAndId = async (req, res) => {
  try {
    const { role, userId } = req.params;
    // role → schema field mapping
    const roleFieldMap = {
      contractor: "selected_contractor",
      inspector: "selected_inspector",
      surveyor: "selected_surveyor",
      me: "selected_me",
      are: "selected_are",
      re: "selected_re",
    };

    const field = roleFieldMap[role];
    if (!field) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Fetch only matched forms
    const contractorForms = await ContractorForm.find({
      [field]: userId,
    });

    const total_length = contractorForms.length;

    const countBy = (key, value) =>
      contractorForms.filter((f) => f[key] === value).length;

    // ================= CONTRACTOR =================
    const pending_request = countBy("contractor_status", "pending");
    const received_request = countBy("contractor_status", "received");
    const received_from_consultant = countBy(
      "contractor_status",
      "received_from_consultant"
    );
    const approved = countBy("contractor_status", "approved");
    const rejected = countBy("contractor_status", "rejected");
    const revert = countBy("contractor_status", "revert");
    const expired = countBy("contractor_status", "expired");

    const total_request =
      pending_request +
      received_request +
      received_from_consultant +
      approved +
      rejected +
      revert +
      expired;

    // ================= CONSULTANT =================
    const consultant_total = contractorForms.filter((form) =>
      [
        "received_from_contractor",
        "pending",
        "send_to_contractor",
        "received_from_re",
        "approved",
        "expired",
        "revert",
      ].includes(form.consultant_status)
    ).length;

    // ================= INSPECTOR =================
    const inspector_okay = countBy("inspector_status", "okay");
    const inspector_not_okay = countBy("inspector_status", "not_okay");
    const inspector_pending = countBy("inspector_status", "pending");
    const inspector_expired = countBy("inspector_status", "expired");

    const inspector_total =
      inspector_okay +
      inspector_not_okay +
      inspector_pending +
      inspector_expired;

    // ================= SURVEYOR =================
    const surveyor_okay = countBy("surveyor_status", "okay");
    const surveyor_not_okay = countBy("surveyor_status", "not_okay");
    const surveyor_pending = countBy("surveyor_status", "pending");
    const surveyor_expired = countBy("surveyor_status", "expired");

    const surveyor_total =
      surveyor_okay +
      surveyor_not_okay +
      surveyor_pending +
      surveyor_expired;

    // ================= ME =================
    const me_okay = countBy("me_status", "okay");
    const me_not_okay = countBy("me_status", "not_okay");
    const me_pending = countBy("me_status", "pending");
    const me_expired = countBy("me_status", "expired");

    const me_total = me_okay + me_not_okay + me_pending + me_expired;
 
    // ================= ARE =================
    const are_okay = countBy("are_status", "okay");
    const are_not_okay = countBy("are_status", "not_okay");
    const are_pending = countBy("are_status", "pending");
    const are_expired = countBy("are_status", "expired");

    const are_total = are_okay + are_not_okay + are_pending + are_expired;

    // ================= RE =================
    const re_approved = countBy("re_status", "okay");
    const re_not_approved = countBy("re_status", "not_okay");
    const re_pending = countBy("re_status", "pending");
    const re_expired = countBy("re_status", "expired");

    const re_total =
      re_approved + re_not_approved + re_pending + re_expired;

    // ================= RESPONSE =================
    const kpiData = {
      total_length,

      constractor: {
        total_request,
        pending_request,
        received_request,
        received_from_consultant,
        approved,
        rejected,
        revert,
        expired,
      },

      consultant: {
        consultant_total,
      },

      inspector: {
        inspector_total,
        inspector_okay,
        inspector_not_okay,
        inspector_pending,
        inspector_expired,
      },

      surveyor: {
        surveyor_total,
        surveyor_okay,
        surveyor_not_okay,
        surveyor_pending,
        surveyor_expired,
      },

      me: {
        me_total,
        me_okay,
        me_not_okay,
        me_pending,
        me_expired,
      },

      are: {
        are_total,
        are_okay,
        are_not_okay,
        are_pending,
        are_expired,
      },

      re: {
        re_total,
        re_approved,
        re_not_approved,
        re_pending,
        re_expired,
      },
    };

    res.status(200).json({
      message: "KPIs Retrieved Successfully",
      kpiData,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in Retrieving Contractor KPIs",
      err,
    });
  }
};
// get Contractor KPIs by Project ID
const getContractorkpisByProject = async (req, res) => {
  try {
    // Get project_id from query parameters (optional)
    const { id } = req.params;
    // Build filter object
    const contractorForms = await ContractorForm.find({ project_id: id });
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
      [
        "pending",
        "received",
        "received_from_consultant",
        "approved",
        "rejected",
        "expired",
        "revert",
      ].includes(form.contractor_status)
    ).length;
    const received_from_consultant = contractorForms.filter(
      (form) => form.contractor_status === "received_from_consultant"
    ).length;
    const pending_request = contractorForms.filter(
      (form) => form.contractor_status === "pending"
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
    const revert = contractorForms.filter(
      (form) => form.contractor_status === "revert"
    ).length;
    const expired = contractorForms.filter(
      (form) => form.contractor_status === "expired"
    ).length;
    const consultant_total = contractorForms.filter((form) => {
      return [
        "received_from_contractor",
        "pending",
        "send_to_contractor",
        "received_from_re",
        "approved",
        "expired",
        "revert",
      ].includes(form.consultant_status);
    }).length;
    const consultant_pending = contractorForms.filter(
      (form) => form.consultant_status === "pending"
    ).length;
    const consultant_revert = contractorForms.filter(
      (form) => form.consultant_status === "revert"
    ).length;
    const consultant_approved = contractorForms.filter(
      (form) => form.consultant_status === "approved"
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
    const consultant_expired = contractorForms.filter(
      (form) => form.consultant_status === "expired"
    ).length;
    const inspector_okay = contractorForms.filter(
      (form) => form.inspector_status === "okay"
    ).length;
    const inspector_not_okay = contractorForms.filter(
      (form) => form.inspector_status === "not_okay"
    ).length;
    const inspector_pending = contractorForms.filter(
      (form) => form.inspector_status === "pending"
    ).length;
    const inspector_expired = contractorForms.filter(
      (form) => form.inspector_status === "expired"
    ).length;
    const inspector_total =
      inspector_okay +
      inspector_not_okay +
      inspector_pending +
      inspector_expired;
    const surveyor_okay = contractorForms.filter(
      (form) => form.surveyor_status === "okay"
    ).length;
    const surveyor_not_okay = contractorForms.filter(
      (form) => form.surveyor_status === "not_okay"
    ).length;
    const surveyor_pending = contractorForms.filter(
      (form) => form.surveyor_status === "pending"
    ).length;
    const surveyor_expired = contractorForms.filter(
      (form) => form.surveyor_status === "expired"
    ).length;
    const surveyor_total =
      surveyor_okay + surveyor_not_okay + surveyor_pending + surveyor_expired;
    const me_okay = contractorForms.filter(
      (form) => form.me_status === "okay"
    ).length;
    const me_not_okay = contractorForms.filter(
      (form) => form.me_status === "not_okay"
    ).length;
    const me_pending = contractorForms.filter(
      (form) => form.me_status === "pending"
    ).length;
    const me_expired = contractorForms.filter(
      (form) => form.me_status === "expired"
    ).length;
    const me_total = me_okay + me_not_okay + me_pending + me_expired;
    const are_okay = contractorForms.filter(
      (form) => form.are_status === "okay"
    ).length;
    const are_not_okay = contractorForms.filter(
      (form) => form.are_status === "not_okay"
    ).length;
    const are_pending = contractorForms.filter(
      (form) => form.are_status === "pending"
    ).length;
    const are_expired = contractorForms.filter(
      (form) => form.are_status === "expired"
    ).length;
    const are_total = are_okay + are_not_okay + are_pending + are_expired;
    const re_approved = contractorForms.filter(
      (form) => form.re_status === "approved"
    ).length;
    const re_not_approved = contractorForms.filter(
      (form) => form.re_status === "not_approved"
    ).length;
    const re_pending = contractorForms.filter(
      (form) => form.re_status === "pending"
    ).length;
    const re_expired = contractorForms.filter(
      (form) => form.re_status === "expired"
    ).length;
    const re_total = re_approved + re_not_approved + re_pending + re_expired;
    //enum: ['received_from_contractor', 'pending','send_to_contractor','received_from_re'],
    const kpiData = {
      total_length,
      constractor: {
        total_request,
        received_request,
        received_from_consultant,
        pending_request,
        approved,
        not_approved,
        revert,
        expired,
      },
      consultant: {
        consultant_total,
        consultant_pending,
        consultant_received_from_contractor,
        consultant_send_to_contractor,
        consultant_received_from_re,
        consultant_revert,
        consultant_approved,
        consultant_expired,
      },
      inspector: {
        inspector_total,
        inspector_okay,
        inspector_not_okay,
        inspector_pending,
        inspector_expired,
      },
      surveyor: {
        surveyor_total,
        surveyor_okay,
        surveyor_not_okay,
        surveyor_pending,
        surveyor_expired,
      },
      me: {
        me_total,
        me_okay,
        me_not_okay,
        me_pending,
        me_expired,
      },
      are: {
        are_total,
        are_okay,
        are_not_okay,
        are_pending,
        are_expired,
      },
      re: {
        re_total,
        re_approved,
        re_not_approved,
        re_pending,
        re_expired,
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
    const { type, status } = req.params;
    // Map "type" to status fields
    const allowedFields = {
      contractor: "contractor_status",
      consultant: "consultant_status",
      inspector: "inspector_status",
      surveyor: "surveyor_status",
      me: "me_status",
      are: "are_status",
      re: "re_status",
    };
    const statusField = allowedFields[type];
    if (!statusField) {
      return res.status(400).json({
        message:
          "Invalid status type. Allowed types: contractor, consultant, inspector, surveyor, re, are",
      });
    }

    let allowedStatuses = [];

    // Define allowed groups based on model enums
    const statusGroups = {
      contractor: [
        "pending",
        "received",
        "received_from_consultant",
        "approved",
        "rejected",
        "expired",
        "revert",
      ],
      // contractor has different values
      inspector: ["okay", "not_okay", "pending", "expired"],
      surveyor: ["okay", "not_okay", "pending", "expired"],
      me: ["okay", "pending", "not_okay", "expired"],
      are: ["okay", "pending", "not_okay", "expired"],
      re: ["okay", "pending", "not_okay", "expired"],
      consultant: [
        "received_from_contractor",
        "pending",
        "send_to_contractor",
        "received_from_re",
        "approved",
        "expired",
        "revert",
      ],
    };
    allowedStatuses = statusGroups[type];
    let contractorForms;
    if (status === "all") {
      // Return only allowed statuses for the selected type
      contractorForms = await ContractorForm.find({
        [statusField]: { $in: allowedStatuses },
      });
    } else {
      contractorForms = await ContractorForm.find({
        [statusField]: status,
      });
    }
    res.status(200).json({
      message: `${type} data retrieved successfully`,
      data: contractorForms,
    });
  } catch (err) {
    res.status(400).json({ message: "Error retrieving contractor forms", err });
  }
};
// get Contractor form by type status role and userId
const getContractorFormsByStatusRoleuserId = async (req, res) => {
  try {
    const { type, status, role, userId } = req.params;

    // Map "type" to status fields
    const allowedFields = {
      contractor: "contractor_status",
      consultant: "consultant_status",
      inspector: "inspector_status",
      surveyor: "surveyor_status",
      me: "me_status",
      are: "are_status",
      re: "re_status",
    };

    const statusField = allowedFields[type];

    if (!statusField) {
      return res.status(400).json({
        message:
          "Invalid status type. Allowed types: contractor, consultant, inspector, surveyor, me, are, re",
      });
    }

    // 🔥 Map role → selected field
    const roleFieldMap = {
      inspector: "selected_inspector",
      surveyor: "selected_surveyor",
      me: "selected_me",
      are: "selected_are",
      re: "selected_re",
      consultant: "selected_consultant", // only if exists
      contractor: "selected_contractor", // optional
    };

    const selectedField = roleFieldMap[role];

    if (!selectedField) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // Allowed statuses by type
    const statusGroups = {
      contractor: [
        "pending",
        "received",
        "received_from_consultant",
        "approved",
        "rejected",
        "expired",
        "revert",
      ],
      inspector: ["okay", "not_okay", "pending", "expired"],
      surveyor: ["okay", "not_okay", "pending", "expired"],
      me: ["okay", "pending", "not_okay", "expired"],
      are: ["okay", "pending", "not_okay", "expired"],
      re: ["okay", "pending", "not_okay", "expired"],
      consultant: [
        "received_from_contractor",
        "pending",
        "send_to_contractor",
        "received_from_re",
        "approved",
        "expired",
        "revert",
      ],
    };

    const allowedStatuses = statusGroups[type];

    // ================= QUERY BUILD =================
    let query = {
      [selectedField]: userId, // 👈 role-based filter
    };

    if (status === "all") {
      query[statusField] = { $in: allowedStatuses };
    } else {
      query[statusField] = status;
    }

    const contractorForms = await ContractorForm.find(query);

    res.status(200).json({
      message: `${type} Data retrieved successfully`,
      data: contractorForms,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving contractor forms",
      err,
    });
  }
};
// get list by projectId and status
const getContractorFormsByProjectAndStatus = async (req, res) => {
  try {
    const { projectId, type, status } = req.params;
    const allowedFields = {
      contractor: "contractor_status",
      consultant: "consultant_status",
      inspector: "inspector_status",
      surveyor: "surveyor_status",
      me: "me_status",
      are: "are_status",
      re: "re_status",
    };
    // Check if type is valid
    const statusField = allowedFields[type];
    if (!statusField) {
      return res.status(400).json({
        message:
          "Invalid status type. Allowed types: contractor, consultant, inspector, surveyor, re, are",
      });
    }
    let contractorForms;
    // If user wants ALL data
    if (status === "all") {
      contractorForms = await ContractorForm.find({ project_id: projectId });
    } else {
      // Filter based on selected status field
      contractorForms = await ContractorForm.find({
        project_id: projectId,
        [statusField]: status,
      });
    }
    res.status(200).json({
      message: "Contractor Forms Retrieved Successfully",
      data: contractorForms,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error in Retrieving Contractor Forms", err });
  }
};
// get list by projectId status role and userId
const getContractorFormsByProjectAndStatusRoleuserId = async (req, res) => {
  try {
    const { projectId, type, status, role, userId } = req.params;

    // Map "type" → status fields
    const allowedFields = {
      contractor: "contractor_status",
      consultant: "consultant_status",
      inspector: "inspector_status",
      surveyor: "surveyor_status",
      me: "me_status",
      are: "are_status",
      re: "re_status",
    };

    const statusField = allowedFields[type];

    if (!statusField) {
      return res.status(400).json({
        message:
          "Invalid status type. Allowed types: contractor, consultant, inspector, surveyor, me, are, re",
      });
    }

    // Map role → selected_* fields
    const roleFieldMap = {
      inspector: "selected_inspector",
      surveyor: "selected_surveyor",
      me: "selected_me",
      are: "selected_are",
      re: "selected_re",
      consultant: "selected_consultant", // only if exists
      contractor: "selected_contractor", // optional
    };

    const selectedField = roleFieldMap[role];

    if (!selectedField) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // ================= QUERY BUILD =================
    let query = {
      project_id: projectId,
      [selectedField]: userId, // 👈 role-based filtering
    };

    if (status !== "all") {
      query[statusField] = status;
    }

    const contractorForms = await ContractorForm.find(query);

    res.status(200).json({
      message: "Contractor Forms Retrieved Successfully",
      data: contractorForms,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in Retrieving Contractor Forms",
      err,
    });
  }
};

// get list status of consultant by status
const createContractorForm = async (req, res) => {
  try {
    const contractorForm = req.body;
    // ---------------- DEFAULT STATUS ----------------
    if (
      !contractorForm.contractor_status ||
      contractorForm.contractor_status.trim() === ""
    ) {
      contractorForm.contractor_status = "pending"; // default
    }

    // ---------------- VALIDATE PROJECT ID ----------------
    if (!contractorForm.project_id) {
      return res.status(400).json({ message: "Project is required" });
    }

    // if (!mongoose.Types.ObjectId.isValid(contractorForm.project_id)) {
    //   return res.status(400).json({ message: "Invalid project ID" });
    // }

    // ---------------- FETCH PROJECT TITLE ----------------
    const project = await Project.findById(contractorForm.project_id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    contractorForm.project_title = project.project_title; // auto-fill title

    // ---------------- SAVE CONTRACTOR FORM ----------------
    const newContractorForm = new ContractorForm(contractorForm);
    await newContractorForm.save();

    return res.status(201).json({
      message: "Contractor Form Created Successfully",
      newContractorForm,
    });
  } catch (err) {
    console.error(err); // log exact error for debugging
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }
    return res
      .status(500)
      .json({ message: "Error in Creating Contractor Form" });
  }
};
const getContractorForms = async (req, res) => {
  try {
    const contractorForms = await ContractorForm.find();
    res.status(200).json({
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

    res.status(200).json({
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
    res.status(200).json({
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
  getContractorkpisByRoleAndId,
  getContractorkpisByProject,
  getContractorFormsByStatus,
  getContractorFormsByStatusRoleuserId,
  getContractorFormsByProjectAndStatus,
  getContractorFormsByProjectAndStatusRoleuserId,
  createContractorForm,
  getContractorForms,
  getContractorFormById,
  updateContractorForm,
  deleteContractorForm,
};
