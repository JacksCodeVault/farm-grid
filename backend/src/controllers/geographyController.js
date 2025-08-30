const db = require('../db/database');

exports.createRegion = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Please provide a name for the region.' });
  }

  try {
    await db('regions').insert({ name });
    const [newRegion] = await db('regions').where({ name }).orderBy('id', 'desc').limit(1);
    res.status(201).json({
      message: 'Region created successfully',
      region: newRegion
    });
  } catch (error) {
    console.error('Error creating region:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRegions = async (req, res) => {
  try {
  const regions = await db('regions').select('id', 'name');
    res.status(200).json(regions);
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRegionById = async (req, res) => {
  try {
    const { id } = req.params;
  const region = await db('regions').where({ id }).select('id', 'name').first();

    if (!region) {
      return res.status(404).json({ message: 'Region not found' });
    }
    res.status(200).json(region);
  } catch (error) {
    console.error('Error fetching region by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRegion = async (req, res) => {
  const { id } = req.params;
  const { name, is_active } = req.body;

  try {
    const regionToUpdate = await db('regions').where({ id }).first();
    if (!regionToUpdate) {
      return res.status(404).json({ message: 'Region not found' });
    }

    await db('regions').where({ id }).update({
      name: name || regionToUpdate.name
    });

    const updatedRegion = await db('regions').where({ id }).first();

    res.status(200).json({
      message: 'Region updated successfully',
      region: updatedRegion
    });
  } catch (error) {
    console.error('Error updating region:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRegion = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await db('regions').where({ id }).del();

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Region not found' });
    }
    res.status(200).json({ message: 'Region deleted successfully' });
  } catch (error) {
    console.error('Error deleting region:', error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      res.status(409).json({ message: 'Cannot delete region: there are related records (such as villages, districts, or farmers) that depend on this region. Please remove or reassign related data before deleting.' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

exports.createDistrict = async (req, res) => {
  const { name, region_id } = req.body;

  if (!name || !region_id) {
    return res.status(400).json({ message: 'Please provide a name and region_id for the district.' });
  }

  try {
    await db('districts').insert({ name, region_id });
    const [newDistrict] = await db('districts').where({ name, region_id }).orderBy('id', 'desc').limit(1);
    res.status(201).json({
      message: 'District created successfully',
      district: newDistrict
    });
  } catch (error) {
    console.error('Error creating district:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      res.status(409).json({ message: 'Cannot create district: the specified region does not exist. Please provide a valid region_id.' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

exports.getDistricts = async (req, res) => {
  try {
    const districts = await db('districts').select('id', 'name', 'region_id');
    res.status(200).json(districts);
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getDistrictById = async (req, res) => {
  try {
    const { id } = req.params;
  const district = await db('districts').where({ id }).select('id', 'name', 'region_id').first();

    if (!district) {
      return res.status(404).json({ message: 'District not found' });
    }
    res.status(200).json(district);
  } catch (error) {
    console.error('Error fetching district by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateDistrict = async (req, res) => {
  const { id } = req.params;
  const { name, region_id, is_active } = req.body;

  try {
    const districtToUpdate = await db('districts').where({ id }).first();
    if (!districtToUpdate) {
      return res.status(404).json({ message: 'District not found' });
    }

    await db('districts').where({ id }).update({
      name: name || districtToUpdate.name,
      region_id: region_id || districtToUpdate.region_id
    });

    const updatedDistrict = await db('districts').where({ id }).first();

    res.status(200).json({
      message: 'District updated successfully',
      district: updatedDistrict
    });
  } catch (error) {
    console.error('Error updating district:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      res.status(409).json({ message: 'Cannot update district: the specified region does not exist. Please provide a valid region_id.' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

exports.deleteDistrict = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await db('districts').where({ id }).del();

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'District not found' });
    }
    res.status(200).json({ message: 'District deleted successfully' });
  } catch (error) {
    console.error('Error deleting district:', error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      res.status(409).json({ message: 'Cannot delete district: there are related records (such as villages or farmers) that depend on this district. Please remove or reassign related data before deleting.' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

exports.createVillage = async (req, res) => {
  const { name, district_id } = req.body;

  if (!name || !district_id) {
    return res.status(400).json({ message: 'Please provide a name and district_id for the village.' });
  }

  try {
    await db('villages').insert({ name, district_id });
    const [newVillage] = await db('villages').where({ name, district_id }).orderBy('id', 'desc').limit(1);
    res.status(201).json({
      message: 'Village created successfully',
      village: newVillage
    });
  } catch (error) {
    console.error('Error creating village:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getVillages = async (req, res) => {
  try {
    const villages = await db('villages').select('id', 'name', 'district_id');
    res.status(200).json(villages);
  } catch (error) {
    console.error('Error fetching villages:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getVillageById = async (req, res) => {
  try {
    const { id } = req.params;
  const village = await db('villages').where({ id }).select('id', 'name', 'district_id').first();

    if (!village) {
      return res.status(404).json({ message: 'Village not found' });
    }
    res.status(200).json(village);
  } catch (error) {
    console.error('Error fetching village by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateVillage = async (req, res) => {
  const { id } = req.params;
  const { name, district_id, is_active } = req.body;

  try {
    const villageToUpdate = await db('villages').where({ id }).first();
    if (!villageToUpdate) {
      return res.status(404).json({ message: 'Village not found' });
    }

    await db('villages').where({ id }).update({
      name: name || villageToUpdate.name,
      district_id: district_id || villageToUpdate.district_id
    });

    const updatedVillage = await db('villages').where({ id }).first();

    res.status(200).json({
      message: 'Village updated successfully',
      village: updatedVillage
    });
  } catch (error) {
    console.error('Error updating village:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteVillage = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await db('villages').where({ id }).del();

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Village not found' });
    }
    res.status(200).json({ message: 'Village deleted successfully' });
  } catch (error) {
    console.error('Error deleting village:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
