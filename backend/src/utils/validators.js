const { body } = require('express-validator');

const userValidationRules = {
  register: [
    body('name')
      .isLength({ min: 20, max: 60 })
      .withMessage('Name must be between 20 and 60 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8, max: 16 })
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage('Password must be 8-16 characters with at least one uppercase letter and one special character'),
    body('address')
      .optional()
      .isLength({ max: 400 })
      .withMessage('Address cannot exceed 400 characters'),
    body('role')
      .optional()
      .isIn(['admin', 'store_owner', 'normal_user'])
      .withMessage('Invalid role')
  ],
  
  updatePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8, max: 16 })
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage('Password must be 8-16 characters with at least one uppercase letter and one special character')
  ],

  createStore: [
    body('name')
      .notEmpty()
      .withMessage('Store name is required'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('address')
      .notEmpty()
      .isLength({ max: 400 })
      .withMessage('Address is required and cannot exceed 400 characters'),
    body('owner_id')
      .optional()
      .isInt()
      .withMessage('Valid owner ID is required')
  ],

  rating: [
    body('store_id')
      .isInt()
      .withMessage('Valid store ID is required'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5')
  ]
};

module.exports = userValidationRules;