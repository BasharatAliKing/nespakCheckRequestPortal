const Project = require('../models/projectModel');

// Create project
const createProject = async (req, res) => {
  try {
    const { project_client, project_contractor, project_consultant, project_job_no, project_title } = req.body;
    const newProject = new Project({ project_client, project_contractor, project_consultant, project_job_no, project_title });
    await newProject.save();
    res.status(201).json({ message: 'Project Created Successfully', project: newProject });
  } catch (err) {
    res.status(400).json({ message: 'Error Creating Project', err });
  }
};

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ message: 'Projects Retrieved Successfully', projects });
  } catch (err) {
    res.status(400).json({ message: 'Error Retrieving Projects', err });
  }
};

// Get project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project Not Found' });
    res.status(200).json({ message: 'Project Retrieved Successfully', project });
  } catch (err) {
    res.status(400).json({ message: 'Error Retrieving Project', err });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const updates = req.body;
    const updated = await Project.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Project Not Found' });
    res.status(200).json({ message: 'Project Updated Successfully', project: updated });
  } catch (err) {
    res.status(400).json({ message: 'Error Updating Project', err });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Project Not Found' });
    res.status(200).json({ message: 'Project Deleted Successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error Deleting Project', err });
  }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject };
