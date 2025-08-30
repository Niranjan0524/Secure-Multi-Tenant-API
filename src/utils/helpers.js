import Organization from '../models/Organization';

export const generateApiKey = () => {
    return require('crypto').randomBytes(32).toString('hex');
};

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const hashPassword = async (password) => {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (password, hashedPassword) => {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(password, hashedPassword);
};

//we need to check if the user is first user for particular organization so that he can be admin
export const checkIfFirstUser=async(req,res,next)=>{
   const userCount=await User.countDocuments({OrganizationID:req.body.OrganizationID})
   if(userCount===0){
       req.body.role='admin';
   }
   else{
    res.status(403).json({ message: 'First user already exists ,you dont have access for this event' });
   }
   next();
}