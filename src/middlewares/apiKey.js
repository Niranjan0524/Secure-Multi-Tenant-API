const ApiKey=require("../models/ApiKey.js");
const {validateApiKeyFormat} =require("../utils/helpers.js");

const authenticateApiKey = async (req, res, next) => {

  // we can get api key from different sources so..
  const apiKey =
    req.header('X-API-Key') ||
    req.query.api_key;

  if (!apiKey) {
    return res.status(401).json({
      message:
        "API key required. Provide it via X-API-Key header, Authorization header, or api_key query parameter.",
    });
  }

  // Validate API key format
  console.log("API Key from request:", apiKey);
  if (!validateApiKeyFormat(apiKey)) {
    return res.status(401).json({
      message: "Invalid API key format.",
    });
  }
console.log("API Key format validated");
  try {
    //validating api key
    const keyRecord = await ApiKey.findOne({
      key: apiKey,
      isActive: true,
    })
      .populate("organizationId", "name isActive")
      .populate("createdBy", "name email");

      console.log("API Key record found:", keyRecord);
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
    if (!keyRecord.isActive) {
      return res.status(403).json({
        message: "Organization is inactive.",
      });
    }

    // Update last used timestamp (async, don't wait)
    ApiKey.findByIdAndUpdate(keyRecord._id, {
      lastUsedAt: new Date(),
    }).exec();

    //checking if user's org and api key's org are same or not
    if (req.user.organizationId.toString() !== keyRecord.organizationId._id.toString()) {
      return res.status(403).json({
        message: "User does not belong to the same organization as the API key.",
      });
    }

    // Attach API key info to request
    req.apiKey = {
      id: keyRecord._id,
      name: keyRecord.name,
      permissions: keyRecord.permissions,
      organizationId: keyRecord.organizationId._id,
      organization: keyRecord.organizationId,
      createdBy: keyRecord.createdBy,
    };

    // Also attach user info for downstream use
    req.user = {
      userId: keyRecord.createdBy._id,
      organizationId: keyRecord.organizationId._id,
      role: "admin", 
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