const db = require('../db/database');
const bcrypt = require('bcryptjs');

exports.createFieldOperator = async (req, res) => {
  const { name, email, phone_number } = req.body;
  const coopAdminId = req.user.id; // Assuming req.user contains the authenticated COOP_ADMIN's ID

  try {
    // Find the cooperative ID associated with the COOP_ADMIN
    const [coopAdmin] = await db('users').where({ id: coopAdminId, role: 'COOP_ADMIN' });
    if (!coopAdmin || !coopAdmin.organization_id) {
      return res.status(403).json({ message: 'Unauthorized: COOP_ADMIN not found or not associated with an organization.' });
    }

    // Generate a strong random password
    const randomPassword = require('crypto').randomBytes(16).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    const result = await db('users').insert({
      name,
      email,
      phone_number,
      password: hashedPassword,
      role: 'FIELD_OPERATOR',
      organization_id: coopAdmin.organization_id // Link to the COOP_ADMIN's organization
    });
    const userId = result[0];
    const newFieldOperator = await db('users').where({ id: userId }).first();

    res.status(201).json({
      message: 'FIELD_OPERATOR created successfully',
      user: {
        id: newFieldOperator.id,
        name: newFieldOperator.name,
        email: newFieldOperator.email,
        phone_number: newFieldOperator.phone_number,
        role: newFieldOperator.role,
        organization_id: newFieldOperator.organization_id
      }
    });
  } catch (error) {
    console.error('Error creating field operator:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
