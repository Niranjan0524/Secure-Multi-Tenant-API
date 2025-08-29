import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

// Middleware to update the updatedAt field on save
apiKeySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

export default ApiKey;