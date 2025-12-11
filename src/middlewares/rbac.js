const roleControl = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        console.log("User role:", userRole);
        console.log("Allowed roles:", roles);
        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }

        next();
    };
};

module.exports = roleControl;