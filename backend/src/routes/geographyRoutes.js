const express = require('express');
const router = express.Router();
const {
  createRegion, getRegions, getRegionById, updateRegion, deleteRegion,
  createDistrict, getDistricts, getDistrictById, updateDistrict, deleteDistrict,
  createVillage, getVillages, getVillageById, updateVillage, deleteVillage
} = require('../controllers/geographyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Regions
router.post('/regions', protect, authorize(['SYSTEM_ADMIN']), createRegion);
router.get('/regions', protect, authorize(['SYSTEM_ADMIN', 'BOARD_MEMBER']), getRegions);
router.get('/regions/:id', protect, authorize(['SYSTEM_ADMIN', 'BOARD_MEMBER']), getRegionById);
router.patch('/regions/:id', protect, authorize(['SYSTEM_ADMIN']), updateRegion);
router.delete('/regions/:id', protect, authorize(['SYSTEM_ADMIN']), deleteRegion);

// Districts
router.post('/districts', protect, authorize(['SYSTEM_ADMIN']), createDistrict);
router.get('/districts', protect, authorize(['SYSTEM_ADMIN', 'BOARD_MEMBER']), getDistricts);
router.get('/districts/:id', protect, authorize(['SYSTEM_ADMIN', 'BOARD_MEMBER']), getDistrictById);
router.patch('/districts/:id', protect, authorize(['SYSTEM_ADMIN']), updateDistrict);
router.delete('/districts/:id', protect, authorize(['SYSTEM_ADMIN']), deleteDistrict);

// Villages
router.post('/villages', protect, authorize(['SYSTEM_ADMIN']), createVillage);
router.get('/villages', protect, authorize(['SYSTEM_ADMIN', 'BOARD_MEMBER', 'COOP_ADMIN']), getVillages);
router.get('/villages/:id', protect, authorize(['SYSTEM_ADMIN', 'BOARD_MEMBER']), getVillageById);
router.patch('/villages/:id', protect, authorize(['SYSTEM_ADMIN']), updateVillage);
router.delete('/villages/:id', protect, authorize(['SYSTEM_ADMIN']), deleteVillage);

module.exports = router;
