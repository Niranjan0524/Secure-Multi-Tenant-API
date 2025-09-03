const mongoose = require("mongoose"); // Use CommonJS for compatibility

const apiKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  permissions: {
    type: [String],
    default: [],
  },
  lastUsedAt: {
    type: Date,
    default: null,
  },
  expiresAt: {
    type: Date,
    default: null,
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
  revokedAt: {
    type: Date,
    default: null,
  },
});

// Middleware to update the updatedAt field on save
apiKeySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

module.exports = ApiKey;
