const Organization = require('../models/Organization.js');

// Create a new organization
const createOrganization = async (req, res) => {
    const { name, address } = req.body;

    try {
        const newOrganization = new Organization({
            name,
            address
        });

        await newOrganization.save();
        res.status(201).json({ message: 'Organization created successfully', organization: newOrganization });
    } catch (error) {
        res.status(500).json({ message: 'Error creating organization', error: error.message });
    }
};

// Get organization details
const getOrganization = async (req, res) => {
    const organizationId = req.user.organizationId;

    try {
        const organization = await Organization.findOne({ _id: organizationId });

        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.status(200).json(organization);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching organization', error: error.message });
    }
};

const getAllOrganizations = async (req, res) => {
    const userId = req.user.userId;

    try {
        const organizations = await Organization.find({ userId });

        res.status(200).json(organizations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching organizations', error: error.message });
    }
};

// Update organization details
const updateOrganization = async (req, res) => {
    const organizationId = req.user.organizationId;
    const updates = req.body;

    try {
        const organization = await Organization.findOneAndUpdate({ _id: organizationId }, updates, { new: true });

        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.status(200).json({ message: 'Organization updated successfully', organization });
    } catch (error) {
        res.status(500).json({ message: 'Error updating organization', error: error.message });
    }
};

// Delete organization
const deleteOrganization = async (req, res) => {
    const organizationId = req.user.organizationId;

    try {
        const organization = await Organization.findOneAndDelete({ _id: organizationId });

        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.status(200).json({ message: 'Organization deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting organization', error: error.message });
    }
};

module.exports = {
    createOrganization,
    getOrganization,
    getAllOrganizations,
    updateOrganization,
    deleteOrganization
};