const express=require('express');
const ContractorForm=require('../models/contractorFormModel');

const createContractorForm=async(req,res)=>{
    try{
      const contractorForm=req.body;
        const newContractorForm=new ContractorForm(contractorForm);
        await newContractorForm.save();
        res.status(201).json({message:"Contractor Form Created Successfully",newContractorForm});
    }catch(err){
        res.status(400).json({message:"Error in Creating Contractor Form",err});
    }
}

const getContractorForms=async(req,res)=>{
    try{
        const contractorForms=await ContractorForm.find();
        res.status(200).json({message:"Contractor Forms Retrieved Successfully",contractorForms});
    }catch(err){
        res.status(400).json({message:"Error in Retrieving Contractor Forms",err});
    }
}

const getContractorFormById=async(req,res)=>{
    try{
        const contractorFormId=req.params.id;
        const contractorForm=await ContractorForm.findById(contractorFormId);
        
        if(!contractorForm){
            return res.status(404).json({message:"Contractor Form not found"});
        }
        
        res.status(200).json({message:"Contractor Form Retrieved Successfully",contractorForm});
    }catch(err){
        res.status(400).json({message:"Error in Retrieving Contractor Form",err});
    }
}

const updateContractorForm=async(req,res)=>{
    try{
        const contractorFormId=req.params.id;
        const updatedData=req.body;
        
        const updatedContractorForm=await ContractorForm.findByIdAndUpdate(
            contractorFormId,
            updatedData,
            {new:true}
        );
        
        if(!updatedContractorForm){
            return res.status(404).json({message:"Contractor Form not found"});
        }
        
        res.status(200).json({message:"Contractor Form Updated Successfully",updatedContractorForm});
    }catch(err){
        res.status(400).json({message:"Error in Updating Contractor Form",err});
    }
}

const deleteContractorForm=async(req,res)=>{
    try{
        const contractorFormId=req.params.id;
        const deletedContractorForm=await ContractorForm.findByIdAndDelete(contractorFormId);
        
        if(!deletedContractorForm){
            return res.status(404).json({message:"Contractor Form not found"});
        }
        
        res.status(200).json({message:"Contractor Form Deleted Successfully"});
    }catch(err){
        res.status(400).json({message:"Error in Deleting Contractor Form",err});
    }
}

module.exports={
    createContractorForm,
    getContractorForms,
    getContractorFormById,
    updateContractorForm,
    deleteContractorForm
};