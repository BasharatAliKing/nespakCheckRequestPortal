const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    project_client: { type: String, required: true },
    project_contractor: { type: String, required: true },
    project_consultant: { type: String, required: true },
    project_job_no: { type: String, required: true, unique: true, trim: true },
    project_title: { type: String, required: true },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
