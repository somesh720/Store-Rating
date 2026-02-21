const router = require('express').Router();
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');
const validateRequest = require('../middleware/validation.middleware');
const userValidationRules = require('../utils/validators');
const { authenticate } = require('../middleware/auth.middleware');

// Register
router.post('/register', 
  userValidationRules.register, 
  validateRequest, 
  AuthController.register
);

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], validateRequest, AuthController.login);

// Change password
router.post('/change-password', 
  authenticate,
  userValidationRules.updatePassword,
  validateRequest,
  AuthController.changePassword
);

module.exports = router;