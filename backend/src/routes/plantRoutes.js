const express = require('express');
const router = express.Router();
const {
  getPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
} = require('../controllers/plantController');
const { addGrowthUpdate, getGrowthHistory } = require('../controllers/growthController');
const { logCareActivity, getCareActivities } = require('../controllers/careController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect); // Protect all plant routes

router.route('/')
  .get(getPlants)
  .post(upload.single('image'), createPlant);

router.route('/:id')
  .get(getPlantById)
  .put(upload.single('image'), updatePlant)
  .delete(deletePlant);

// Growth subroutes for plant
router.route('/:id/growth')
  .get(getGrowthHistory)
  .post(upload.single('image'), addGrowthUpdate);

// Care subroutes for plant
router.route('/:id/care')
  .get(getCareActivities)
  .post(logCareActivity);

module.exports = router;
