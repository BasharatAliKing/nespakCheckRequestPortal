const express = require("express");
const Contractor = require("../models/contractorModel");
const fs = require('fs');
const path = require('path');

const createContractor = async (req, res) => {
  try {
    const { contractor_name } = req.body;
    const contractorData = { contractor_name };
    
    if (req.file) {
      contractorData.contractor_logo = req.file.path;
    }
    
    const newContractor = new Contractor(contractorData);
    await newContractor.save();
    res.status(201).json({ message: "Contractor Created Successfully", newContractor });
  } catch (err) {
    res.status(400).json({ message: "Error in Creating Contractor", err });
  }
};

const getContractors = async (req, res) => {
  try {
    const contractors = await Contractor.find();
    res
      .status(200)
      .json({ message: "Contractors Retrieved Successfully", contractors });
  } catch (err) {
    res.status(400).json({ message: "Error in Retrieving Contractors", err });
  }
};

const deleteContractor = async (req, res) => {
  try {
    const contractorId = req.params.id;
    const contractor = await Contractor.findById(contractorId);
    
    if (contractor && contractor.contractor_logo) {
      const logoPath = path.join(__dirname, '../../', contractor.contractor_logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }
    
    await Contractor.findByIdAndDelete(contractorId);
    res.status(200).json({ message: "Contractor Deleted Successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error in Deleting Contractor", err });
  }
};

const getContractorById = async (req, res) => {
    try {
        const contractorId = req.params.id;
        const contractor = await Contractor.findById(contractorId);
        res.status(200).json({ message: "Contractor Retrieved Successfully", contractor });
    } catch (err) {
        res.status(400).json({ message: "Error in Retrieving Contractor", err });
    }
};

const updateContractor = async (req, res) => {
  try {
    const contractorId = req.params.id;
    const updatedData = req.body;
    
    if (req.file) {
      const contractor = await Contractor.findById(contractorId);
      
      if (contractor && contractor.contractor_logo) {
        const oldLogoPath = path.join(__dirname, '../../', contractor.contractor_logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      
      updatedData.contractor_logo = req.file.path;
    }
    
    const updatedContractor = await Contractor.findByIdAndUpdate(
      contractorId,
      updatedData,
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Contractor Updated Successfully", updatedContractor });
  } catch (err) {
    res.status(400).json({ message: "Error in Updating Contractor", err });
  }
};

module.exports = {
    createContractor,
    getContractors,
    deleteContractor,
    updateContractor,
    getContractorById,
};
