const db = require('../db/database');
const bcrypt = require('bcryptjs');

exports.createFieldOperator = async (req, res) => {
  const { username, email, password } = req.body;
  const coopAdminId = req.user.id; // Assuming req.user contains the authenticated COOP_ADMIN's ID

  try {
    // Find the cooperative ID associated with the COOP_ADMIN
    const [coopAdmin] = await db('users').where({ id: coopAdminId, role: 'COOP_ADMIN' });
    if (!coopAdmin || !coopAdmin.organization_id) {
      return res.status(403).json({ message: 'Unauthorized: COOP_ADMIN not found or not associated with an organization.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newFieldOperator] = await db('users').insert({
      username,
      email,
      password: hashedPassword,
      role: 'FIELD_OPERATOR',
      organization_id: coopAdmin.organization_id // Link to the COOP_ADMIN's organization
    }).returning('*');

    res.status(201).json({
      message: 'FIELD_OPERATOR created successfully',
      user: {
        id: newFieldOperator.id,
        username: newFieldOperator.username,
        email: newFieldOperator.email,
        role: newFieldOperator.role,
        organization_id: newFieldOperator.organization_id
      }
    });
  } catch (error) {
    console.error('Error creating field operator:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
