const express=require('express');
const ContractorForm=require('../models/contractorFormModel');


const getContractorkpis=async(req,res)=>{
    try{
        const contractorForms=await ContractorForm.find();
        // Get unique contractor names
        const uniqueNames = [...new Set(contractorForms
            .map(form => form.contractor_name)
            .filter(name => name))];
        // Calculate statistics
        const total_length = contractorForms.length;
        console.log(total_length);
        const total_request = contractorForms.filter(form => 
            ['send', 'received', 'approved', 'rejected', 'expired'].includes(form.contractor_status)
        ).length;
        const received_request = contractorForms.filter(form => 
            form.contractor_status === 'received'
        ).length;
        const approved = contractorForms.filter(form => 
            form.contractor_status === 'approved'
        ).length;
        const not_approved = contractorForms.filter(form => 
            form.contractor_status === 'rejected'
        ).length;
        const expired = contractorForms.filter(form => 
            form.contractor_status === 'expired'
        ).length;
        
        const kpiData = {
            total_length,
          //  names: uniqueNames,
            total_request,
            received_request,
            approved,
            not_approved,
            expired
        };
      
        res.status(200).json({message:"Contractor KPIs Retrieved Successfully", kpiData});
    }catch(err){
        res.status(400).json({message:"Error in Retrieving Contractor KPIs",err});
    }
}

const getContractorkpisByProject=async(req,res)=>{
    try{
        // Get project_id from query parameters (optional)
        const { project_id } = req.query;
        
        // Build filter object
        const filter = project_id ? { project_id } : {};
        
        const contractorForms=await ContractorForm.find(filter);
        
        // Get unique contractor names
        const uniqueNames = [...new Set(contractorForms
            .map(form => form.contractor_name)
            .filter(name => name))];
        
        // Calculate statistics
        const total_length = contractorForms.length;
        console.log(total_length);
        const total_request = contractorForms.filter(form => 
            ['send', 'received', 'approved', 'rejected', 'expired'].includes(form.contractor_status)
        ).length;
        const received_request = contractorForms.filter(form => 
            form.contractor_status === 'received'
        ).length;
        const approved = contractorForms.filter(form => 
            form.contractor_status === 'approved'
        ).length;
        const not_approved = contractorForms.filter(form => 
            form.contractor_status === 'rejected'
        ).length;
        const expired = contractorForms.filter(form => 
            form.contractor_status === 'expired'
        ).length;
        
        const kpiData = {
            total_length,
            names: uniqueNames,
            total_request,
            received_request,
            approved,
            not_approved,
            expired
        };
        res.status(200).json({message:"Contractor KPIs Retrieved Successfully", kpiData});
    }catch(err){
        res.status(400).json({message:"Error in Retrieving Contractor KPIs",err});
    }
}
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
    getContractorkpis,
    getContractorkpisByProject,
    createContractorForm,
    getContractorForms,
    getContractorFormById,
    updateContractorForm,
    deleteContractorForm
};