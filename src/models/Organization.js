const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update the updatedAt field before saving
organizationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;