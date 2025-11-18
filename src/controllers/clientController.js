const express = require("express");
const Client = require("../models/clientsModel");
const fs = require('fs');
const path = require('path');

const createClient = async (req, res) => {
  try {
    const { client_name } = req.body;
    const clientData = { client_name };
    
    if (req.file) {
      clientData.client_logo = req.file.path;
    }
    
    const newClient = new Client(clientData);
    await newClient.save();
    res.status(201).json({ message: "Client Created Successfully", newClient });
  } catch (err) {
    res.status(400).json({ message: "Error in Creating Client", err });
  }
};
const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res
      .status(200)
      .json({ message: "Clients Retrieved Successfully", clients });
  } catch (err) {
    res.status(400).json({ message: "Error in Retrieving Clients", err });
  }
};
const deleteClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const client = await Client.findById(clientId);
    
    if (client && client.client_logo) {
      const logoPath = path.join(__dirname, '../../', client.client_logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }
    
    await Client.findByIdAndDelete(clientId);
    res.status(200).json({ message: "Client Deleted Successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error in Deleting Client", err });
  }
};
const getClientById = async (req, res) => {
    try {
        const clientId = req.params.id;
        const client = await Client.findById(clientId);
        res.status(200).json({ message: "Client Retrieved Successfully", client });
    } catch (err) {
        res.status(400).json({ message: "Error in Retrieving Client", err });
    }
};
const updateClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const updatedData = req.body;
    
    if (req.file) {
      const client = await Client.findById(clientId);
      
      if (client && client.client_logo) {
        const oldLogoPath = path.join(__dirname, '../../', client.client_logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      
      updatedData.client_logo = req.file.path;
    }
    
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      updatedData,
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Client Updated Successfully", updatedClient });
  } catch (err) {
    res.status(400).json({ message: "Error in Updating Client", err });
  }
};

module.exports = {
    createClient,
    getClients,
    deleteClient,
    updateClient,
    getClientById,
};