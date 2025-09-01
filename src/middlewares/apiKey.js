const ApiKey=require("../models/ApiKey.js");
const {validateApiKeyFormat} =require("../utils/helpers.js");

const authenticateApiKey = async (req, res, next) => {
  // we can get api key from different sources so..
  const apiKey =
    req.header("X-API-Key") ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.query.api_key;

  if (!apiKey) {
    return res.status(401).json({
      message:
        "API key required. Provide it via X-API-Key header, Authorization header, or api_key query parameter.",
    });
  }

  // Validate API key format
  if (!validateApiKeyFormat(apiKey)) {
    return res.status(401).json({
      message: "Invalid API key format.",
    });
  }

  try {
    //validating api key
    const keyRecord = await ApiKey.findOne({
      key: apiKey,
      isActive: true,
    })
      .populate("organizationId", "name isActive")
      .populate("createdBy", "name email");

    if (!keyRecord) {
      return res.status(401).json({
        message: "Invalid or revoked API key.",
      });
    }

    // Checking if API key has expired
    if (keyRecord.expiresAt && new Date() > keyRecord.expiresAt) {
      return res.status(401).json({
        message: "API key has expired.",
      });
    }

    // Checking if organization is active
    if (!keyRecord.organizationId.isActive) {
      return res.status(403).json({
        message: "Organization is inactive.",
      });
    }

    // Update last used timestamp (async, don't wait)
    ApiKey.findByIdAndUpdate(keyRecord._id, {
      lastUsedAt: new Date(),
    }).exec();

    // Attach API key info to request
    req.apiKey = {
      id: keyRecord._id,
      name: keyRecord.name,
      permissions: keyRecord.permissions,
      organizationId: keyRecord.organizationId._id,
      organization: keyRecord.organizationId,
      createdBy: keyRecord.createdBy,
    };

    // For compatibility with existing middleware, also set req.user
    req.user = {
      userId: keyRecord.createdBy._id,
      organizationId: keyRecord.organizationId._id,
      role: "api_key", // Special role for API key requests
      isApiKey: true,
    };

    next();
  } catch (error) {
    res.status(500).json({
      message: "Error validating API key",
      error: error.message,
    });
  }
};


// Middleware to check API key permissions
const requireApiPermission = (requiredPermissions) => {
    return (req, res, next) => {
        if (!req.apiKey) {
            return res.status(401).json({ 
                message: 'API key authentication required.' 
            });
        }

        const hasPermission = requiredPermissions.some(permission => 
            req.apiKey.permissions.includes(permission) || 
            req.apiKey.permissions.includes('admin')
        );

        if (!hasPermission) {
            return res.status(403).json({ 
                message: `Insufficient permissions. Required: ${requiredPermissions.join(' or ')}` 
            });
        }

        next();
    };
};

module.exports = {
    authenticateApiKey,
    requireApiPermission
};