// src/controllers/farmController.js
const db = require('../db/database');

// Create a farm
exports.createFarm = async (req, res) => {
  const { name, size, farmer_id, village_id } = req.body;
  const coopAdminOrgId = req.user.organization_id;
  if (!name || !size || !farmer_id || !village_id) {
    return res.status(400).json({ message: 'Please provide all required fields: name, size, farmer_id, village_id.' });
  }
  try {
    // Optionally, check if farmer belongs to the cooperative
    const farmer = await db('farmers').where({ id: farmer_id, cooperative_id: coopAdminOrgId }).first();
    if (!farmer) {
      return res.status(403).json({ message: 'Farmer does not belong to your cooperative.' });
    }
    const [farmId] = await db('farms').insert({ name, size, farmer_id, village_id });
    const farm = await db('farms').where({ id: farmId }).first();
    res.status(201).json({ message: 'Farm created successfully', farm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating farm' });
  }
};

// List farms
exports.getFarms = async (req, res) => {
  const coopAdminOrgId = req.user.organization_id;
  try {
    // Only show farms for farmers in this cooperative
    const farms = await db('farms')
      .join('farmers', 'farms.farmer_id', 'farmers.id')
      .where('farmers.cooperative_id', coopAdminOrgId)
      .select('farms.*');
    res.status(200).json(farms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching farms' });
  }
};

// Get single farm
exports.getFarmById = async (req, res) => {
  const coopAdminOrgId = req.user.organization_id;
  try {
    const farm = await db('farms')
      .join('farmers', 'farms.farmer_id', 'farmers.id')
      .where('farms.id', req.params.id)
      .where('farmers.cooperative_id', coopAdminOrgId)
      .select('farms.*')
      .first();
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found or not authorized' });
    }
    res.status(200).json(farm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching farm' });
  }
};

// Update farm
exports.updateFarm = async (req, res) => {
  const coopAdminOrgId = req.user.organization_id;
  try {
    // Only allow update if farm belongs to a farmer in this cooperative
    const farm = await db('farms')
      .join('farmers', 'farms.farmer_id', 'farmers.id')
      .where('farms.id', req.params.id)
      .where('farmers.cooperative_id', coopAdminOrgId)
      .select('farms.*')
      .first();
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found or not authorized' });
    }
    await db('farms').where({ id: req.params.id }).update({ ...req.body });
    const updatedFarm = await db('farms').where({ id: req.params.id }).first();
    res.status(200).json({ message: 'Farm updated successfully', farm: updatedFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating farm' });
  }
};

// Delete farm
exports.deleteFarm = async (req, res) => {
  const coopAdminOrgId = req.user.organization_id;
  try {
    // Only allow delete if farm belongs to a farmer in this cooperative
    const farm = await db('farms')
      .join('farmers', 'farms.farmer_id', 'farmers.id')
      .where('farms.id', req.params.id)
      .where('farmers.cooperative_id', coopAdminOrgId)
      .select('farms.*')
      .first();
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found or not authorized' });
    }
    await db('farms').where({ id: req.params.id }).del();
    res.status(200).json({ message: 'Farm deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting farm' });
  }
};
