const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Organization =require("../models/Organization.js");

dotenv.config();


const registerAdmin = async (req, res) => {
    console.log("Register Admin called");
    const {name,email,password}=req.body;
    const {organizationName,organizationAddress} =req.body;

    let organizationId = null;

    try{
        const organization = new Organization({
            name: organizationName,
            address: organizationAddress
        });

        await organization.save();

        organizationId = organization._id;
    } catch (error) {
        return res.status(500).json({ message: 'Error creating organization', error });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: 'admin', organizationId });
        await newUser.save();

        res.status(201).json({ message: 'Admin user registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering admin user', error });
        }
}

// User registration
const register = async (req, res) => {
    const { name, email, password, role ,organizationId } = req.body;
    if(role==='admin'){
        res.status(403).json({ message: 'Only first user can be admin ,you dont have access for this event' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: role || 'user', organizationId });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// User login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role, organizationId: user.organizationId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, userId: user._id, role: user.role, organizationId: user.organizationId });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

module.exports = {
    register,
    login,
    registerAdmin
};