const ApiKey=require("../models/ApiKey.js");
const {generateApiKey}=require("../utils/helpers.js");



//To create new api key:
const createApiKey=async(req,res)=>{

  const {name,permissions,organizationId}=req.body;
  
  const createdBy=req.user.userId;
  
  const apiKey = generateApiKey(organizationId);

  const newApiKey = new ApiKey({
    name,
    key: apiKey,
    organizationId,
    permissions,
    createdBy
  });

await newApiKey.save();

  res.status(201).json({
    message:"API key created successfully",
    apiKey: newApiKey
  });
}


// List organization's API keys (without showing the actual keys)
const getApiKeys = async (req, res) => {
  const organizationId = req.user.organizationId;

  try {
    const apiKeys = await ApiKey.find({
      organizationId,
      isActive: true,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      apiKeys: apiKeys.map((key) => ({
        id: key._id,
        name: key.name,
        permissions: key.permissions,
        lastUsedAt: key.lastUsedAt,
        createdBy: key.createdBy,
        createdAt: key.createdAt,
        expiresAt: key.expiresAt,
        key: key.key.substring(0, 12) + "...", //showing only limited chars for security issues
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching API keys",
      error: error.message,
    });
  }
};


// Rotate API key (replace old with new)
const rotateApiKey = async (req, res) => {
    const { keyId } = req.params;
    const organizationId = req.user.organizationId;

    try {
        const existingKey = await ApiKey.findOne({ 
            _id: keyId, 
            organizationId, 
            isActive: true 
        });

        if (!existingKey) {
            return res.status(404).json({
                message: "API key not found or inactive"
            });
        }

        // Generate a new API key
        const newApiKey = generateApiKey(organizationId);

        // Update the existing key with the new key
        existingKey.key = newApiKey;
        existingKey.lastUsedAt = null; // Reset last used timestamp
        await existingKey.save();

        res.status(200).json({
            message: "API key rotated successfully",
            apiKey: existingKey
        });
    } catch (error) {
        res.status(500).json({
            message: "Error rotating API key",
            error: error.message
        });
    }
};


const revokeApiKey = async (req, res) => {
  const { keyId } = req.params;
  const organizationId = req.user.organizationId;

  try {
    const apiKey = await ApiKey.findOne({
      _id: keyId,
      organizationId,
      isActive: true,
    });

    if (!apiKey) {
      return res.status(404).json({ message: "API key not found" });
    }

    // Mark as revoked
    apiKey.isActive = false;
    apiKey.revokedAt = new Date();
    await apiKey.save();

    res.status(200).json({
      message: "API key revoked successfully",
      revokedKey: {
        id: apiKey._id,
        name: apiKey.name,
        revokedAt: apiKey.revokedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error revoking API key",
      error: error.message,
    });
  }
};


module.exports = {
  createApiKey,
  getApiKeys,
  rotateApiKey,
  revokeApiKey,
};