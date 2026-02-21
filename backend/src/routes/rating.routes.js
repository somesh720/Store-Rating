const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validation.middleware');
const userValidationRules = require('../utils/validators');
const RatingController = require('../controllers/rating.controller');

// All rating routes require authentication
router.use(authenticate);

// Submit or update rating
router.post('/', 
  userValidationRules.rating, 
  validateRequest, 
  RatingController.submitRating
);

// Get user's ratings
router.get('/my-ratings', RatingController.getUserRatings);

module.exports = router;