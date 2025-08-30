const db = require('../db/database');

exports.createOrganization = async (req, res) => {
  const { name, org_type, location_details } = req.body;

  if (!name || !org_type || !location_details) {
    return res.status(400).json({ message: 'Please provide name, org_type, and location_details for the organization.' });
  }

  try {
    await db('organizations').insert({
      name,
      org_type,
      location_details
    });

    // For MySQL, we need to query the newly inserted item manually if we need it
    const [newOrganization] = await db('organizations').where({ name, org_type, location_details }).orderBy('id', 'desc').limit(1);

    res.status(201).json({
      message: 'Organization created successfully',
      organization: newOrganization
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrganizations = async (req, res) => {
  try {
    const organizations = await db('organizations').select('id', 'name', 'org_type', 'location_details');
    res.status(200).json(organizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await db('organizations').where({ id }).select('id', 'name', 'org_type', 'location_details').first();

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.status(200).json(organization);
  } catch (error) {
    console.error('Error fetching organization by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrganization = async (req, res) => {
  const { id } = req.params;
  const { name, org_type, location_details } = req.body; // Removed is_active

  try {
    const organizationToUpdate = await db('organizations').where({ id }).first();
    if (!organizationToUpdate) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    await db('organizations').where({ id }).update({
      name: name || organizationToUpdate.name,
      org_type: org_type || organizationToUpdate.org_type,
      location_details: location_details || organizationToUpdate.location_details,
      updated_at: db.fn.now()
    });

    const updatedOrganization = await db('organizations').where({ id }).first();

    res.status(200).json({
      message: 'Organization updated successfully',
      organization: updatedOrganization
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteOrganization = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await db('organizations').where({ id }).del();

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
