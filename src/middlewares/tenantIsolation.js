const User = require("../models/User");

const tenantIsolation = async (req, res, next) => {
  const userOrganizationId = req.user.organizationId;
  let resourceOrganizationId =
    req.params.organizationId || req.body.organizationId;

  // If we have a userId parameter, get the organization from the user
  if (req.params.userId && !resourceOrganizationId) {
    try {
      const user = await User.findById(req.params.userId);
      if (user) {
        resourceOrganizationId = user.organizationId.toString();
      }
    } catch (error) {
      return res.status(500).json({ message: "Error verifying access" });
    }
  }

  console.log("userOrganizationId:", userOrganizationId);
  console.log("resourceOrganizationId:", resourceOrganizationId);

  if (userOrganizationId !== resourceOrganizationId) {
    return res
      .status(403)
      .json({
        message:
          "Access denied: You do not have permission to access this resource.",
      });
  }

  next();
};

module.exports = tenantIsolation;
