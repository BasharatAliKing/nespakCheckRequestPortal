const Boq = require("../models/boqModel");

//************************************************* */
//  Create a new BOQ
//************************************************* */
exports.createBoq = async (req, res) => {
  try {
    const { project, line_item } = req.body;
    // Validate project ID
    if (!project) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }

    // Check if BOQ already exists for this project
    const existingBoq = await Boq.findOne({ project });

    if (existingBoq) {
      return res.status(409).json({
        message: "This project already has a BOQ",
      });
    }

    const boq = new Boq({
      project,
      line_item,
    }); 
    await boq.save();
    res.status(201).json({ message: "BOQ created Successfully", boq });
  } catch (err) {
    res.status(500).json({ message: "Error creating BOQ", error: err.message });
  }
};
//************************************************* *
//  GET All BOQs
//************************************************* */
exports.getAllBoqs = async (req, res) => {
  try {
    const boqs = await Boq.find();
    res.status(200).json({
      message: "BOQs fetched successfully.",
      boqs,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching BOQs", error: err.message });
  }
};
//************************************************* *
//  GET  BOQ by ID
//************************************************* */
exports.getBoqById = async (req, res) => {
  try {
    const { id } = req.params;
    const boq = await Boq.findById(id);
    if (!boq) {
      return res.status(404).json({ message: "BOQ not found" });
    }
    res.status(200).json({
      message: "BOQ fetched successfully.",
      boq,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching BOQs", error: err.message });
  }
};
//************************************************* *
//  GET  BOQ by Project ID
//************************************************* */
exports.getBoqByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    const boq = await Boq.findOne({ project: projectId });
    if (!boq) {
      return res
        .status(404)
        .json({ message: "BOQ not found for this project" });
    }
    res.status(200).json({
      message: "BOQ fetched successfully.",
      boq,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching BOQs", error: err.message });
  }
};
//************************************************* *
//  DELETE  BOQ by ID
//************************************************* */
exports.deleteBoqById = async (req, res) => {
  try {
    const { id } = req.params;
    const boq = await Boq.findByIdAndDelete(id);
    if (!boq) {
      return res.status(400).json({ message: "BOQ not found !" });
    }
    res.status(200).json({
      message: "BOQ Deleted Successfully ! ",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching BOQs", error: err.message });
  }
};
//************************************************* *
//  Update  BOQ by ID
//************************************************* */
exports.updateBoqById = async (req,res) =>{
  try{
      const {id} = req.params;
      const {project,line_item} = req.body;
      const boq = await Boq.findByIdAndUpdate(id,{project,line_item},{new:true});
      if(!boq){
        return res.status(404).json({message:"BOQ not found"});
      }
      res.status(200).json({
        message:"BOQ updated successfully",
        boq
      });
  }catch(err){
      res
      .status(500)
      .json({ message: "Error fetching BOQs", error: err.message });
  }
}

