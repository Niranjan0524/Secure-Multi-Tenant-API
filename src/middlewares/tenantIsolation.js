//so basically only the admin of the particular organization can access the resources of that organization
const tenantIsolation = (req, res, next) => {
    const userOrganizationId = req.user.organizationId; 
    const resourceOrganizationId = req.params.organizationId || req.body.organizationId; 
    console.log("userOrganizationId:", userOrganizationId);
    console.log("resourceOrganizationId:", resourceOrganizationId); 
    if (userOrganizationId !== resourceOrganizationId) {
        return res.status(403).json({ message: 'Access denied: You do not have permission to access this resource.' });
    }

    next();
};

module.exports = tenantIsolation;