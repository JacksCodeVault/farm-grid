const db = require('../db/database');

exports.createCommodity = async (req, res) => {
  const { name, standard_unit } = req.body;

  if (!name || !standard_unit) {
    return res.status(400).json({ message: 'Please provide name and standard unit for the commodity.' });
  }

  try {
    await db('commodities').insert({
      name,
      standard_unit
    });

    const [newCommodity] = await db('commodities').where({ name, standard_unit }).orderBy('id', 'desc').limit(1);

    res.status(201).json({
      message: 'Commodity created successfully',
      commodity: newCommodity
    });
  } catch (error) {
    console.error('Error creating commodity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCommodities = async (req, res) => {
  try {
    const commodities = await db('commodities').select('id', 'name', 'standard_unit');
    res.status(200).json(commodities);
  } catch (error) {
    console.error('Error fetching commodities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCommodityById = async (req, res) => {
  try {
    const { id } = req.params;
  const commodity = await db('commodities').where({ id }).select('id', 'name', 'standard_unit').first();

    if (!commodity) {
      return res.status(404).json({ message: 'Commodity not found' });
    }
    res.status(200).json(commodity);
  } catch (error) {
    console.error('Error fetching commodity by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCommodity = async (req, res) => {
  const { id } = req.params;
  const { name, unit_of_measure, is_active } = req.body;

  try {
    const commodityToUpdate = await db('commodities').where({ id }).first();
    if (!commodityToUpdate) {
      return res.status(404).json({ message: 'Commodity not found' });
    }

    await db('commodities').where({ id }).update({
      name: name || commodityToUpdate.name,
      standard_unit: req.body.standard_unit || commodityToUpdate.standard_unit
    });

    const updatedCommodity = await db('commodities').where({ id }).first();

    res.status(200).json({
      message: 'Commodity updated successfully',
      commodity: updatedCommodity
    });
  } catch (error) {
    console.error('Error updating commodity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCommodity = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await db('commodities').where({ id }).del();

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Commodity not found' });
    }
    res.status(200).json({ message: 'Commodity deleted successfully' });
  } catch (error) {
    console.error('Error deleting commodity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
