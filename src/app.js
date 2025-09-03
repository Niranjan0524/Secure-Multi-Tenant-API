const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const organizationRoutes = require('./routes/organizations');
const apiKeyRoutes =require("./routes/apikeys.js");
dotenv.config();

const app = express();


app.use(helmet());
app.use(cors());
app.use(express.json());
//basically each ip can make up to 100 requests every 15 minutes
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 
}));

app.use('/health',(req,res)=>{
    res.status(200).send('API is healthy');
})

//basically only admin/manager can create users
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use("/api/api-keys", apiKeyRoutes);

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

module.exports = app;