const ApiKey=require("../models/ApiKey.js");
const {generateApiKey,validateApiKeyFormat}=require("../utils/helpers.js");
const {validationResult} =require('express-validator');


//To create new api key:

const createApiKey=async(req,res)=>{
  const errors=validationResult(req);

  if(errors.isEmpty()===false){
    return res.status(400).json({errors:errors.array()});
  }

  const {name,permissions}=req.body;
  const organizationId=req.body.organizationId;
  const createdBy=req.user.userId;
  

const apiKey=generateApiKey(organizationId);

const newApiKey=new ApiKey({
  name,
  key:apiKey,
  organizationId,
  createdBy,  
});

await newApiKey.save();

  res.status(201).json({
    message:"API key created successfully",
    apiKey: newApiKey
  });
  
}