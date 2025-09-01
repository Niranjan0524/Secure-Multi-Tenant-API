const User = require('../models/User.js');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
 

  console.log("inside createUser");
  const { name, email, password, role, organizationId } = req.body;
  const adminOrgId=req.user.organizationId;

  //check if user and admin belog to same org
  if(adminOrgId !== organizationId){
    return res.status(401).json({ message: "You can only create users within your organization" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const hashedPassword=bcrypt.hashSync(password,10);
    // Create new user..
    const newUser = new User({
      name,
      email,
      password:hashedPassword,
      role: role || "user",
      organizationId,
    });

    await newUser.save();

    // Return user without password
    const userResponse = await User.findById(newUser._id).select("-password");
    res
      .status(201)
      .json({ message: "User created successfully", user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


//returning all the users of the particular Organization to the admin:
const getAllUsersInOrganization=async(req,res)=>{
  const {organizationId}=req.params;

  if(!organizationId) return res.status(400).json({message:"OrganizationId is required"});

  try{
    const users=await User.find({organizationId}).select("-password");

    if(!users || users.length===0){
      return res.status(404).json({message:"No users found for this organization"});
    }
    res.status(200).json(users);
  }catch(error){
    res.status(500).json({message:"Server error",error:error.message});
  }
}
module.exports = {
    createUser,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getAllUsersInOrganization
};