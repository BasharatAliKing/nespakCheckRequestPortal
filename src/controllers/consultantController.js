const express = require("express");
const Consultant = require("../models/consultantModel");
const fs = require('fs');
const path = require('path');

const createConsultant = async (req, res) => {
  try {
    const { consultant_name } = req.body;
    const consultantData = { consultant_name };
    
    if (req.file) {
      consultantData.consultant_logo = req.file.path;
    }
    
    const newConsultant = new Consultant(consultantData);
    await newConsultant.save();
    res.status(201).json({ message: "Consultant Created Successfully", newConsultant });
  } catch (err) {
    res.status(400).json({ message: "Error in Creating Consultant", err });
  }
};

const getConsultants = async (req, res) => {
  try {
    const consultants = await Consultant.find();
    res
      .status(200)
      .json({ message: "Consultants Retrieved Successfully", consultants });
  } catch (err) {
    res.status(400).json({ message: "Error in Retrieving Consultants", err });
  }
};

const deleteConsultant = async (req, res) => {
  try {
    const consultantId = req.params.id;
    const consultant = await Consultant.findById(consultantId);
    
    if (consultant && consultant.consultant_logo) {
      const logoPath = path.join(__dirname, '../../', consultant.consultant_logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }
    
    await Consultant.findByIdAndDelete(consultantId);
    res.status(200).json({ message: "Consultant Deleted Successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error in Deleting Consultant", err });
  }
};

const getConsultantById = async (req, res) => {
    try {
        const consultantId = req.params.id;
        const consultant = await Consultant.findById(consultantId);
        res.status(200).json({ message: "Consultant Retrieved Successfully", consultant });
    } catch (err) {
        res.status(400).json({ message: "Error in Retrieving Consultant", err });
    }
};

const updateConsultant = async (req, res) => {
  try {
    const consultantId = req.params.id;
    const updatedData = req.body;
    
    if (req.file) {
      const consultant = await Consultant.findById(consultantId);
      
      if (consultant && consultant.consultant_logo) {
        const oldLogoPath = path.join(__dirname, '../../', consultant.consultant_logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      
      updatedData.consultant_logo = req.file.path;
    }
    
    const updatedConsultant = await Consultant.findByIdAndUpdate(
      consultantId,
      updatedData,
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Consultant Updated Successfully", updatedConsultant });
  } catch (err) {
    res.status(400).json({ message: "Error in Updating Consultant", err });
  }
};

module.exports = {
    createConsultant,
    getConsultants,
    deleteConsultant,
    updateConsultant,
    getConsultantById,
};
