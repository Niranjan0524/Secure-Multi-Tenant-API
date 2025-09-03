const User = require("../models/User");

const tenantIsolation = async (req, res, next) => {
  const userOrganizationId = req.user.organizationId;
  let resourceOrganizationId=null;

  // Check if organizationId is provided in the request parameters
  if (req.params.organizationId || req.body.organizationId) {
    resourceOrganizationId = req.params.organizationId || req.body.organizationId;
    if (userOrganizationId !== resourceOrganizationId) {
      return res.status(403).json({
        message:
          "Access denied: You do not have permission to access this resource.",
       });
     }
     next();
  }

  

  const userID = req.params.userId;
  //If we have a userId parameter, get the organization from the user
  console.log("userId: ", userID);
  if (userID && !resourceOrganizationId) {
    try {
      const user = await User.findById(userID);
      if (user) {
        resourceOrganizationId = user.organizationId.toString();
      }
      console.log("userOrganizationId:", userOrganizationId);
      console.log("resourceOrganizationId:", resourceOrganizationId);

      if (userOrganizationId !== resourceOrganizationId) {
        return res.status(403).json({
          message:
            "Access denied: You do not have permission to access this resource.",
        });
      }

    } catch (error) {
      return res.status(500).json({ message: "Error verifying access" });
    }
  }

  

  next();
};

module.exports = tenantIsolation;
