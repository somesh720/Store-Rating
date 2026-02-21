const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const AdminController = require('../controllers/admin.controller');
const validateRequest = require('../middleware/validation.middleware');
const userValidationRules = require('../utils/validators');

// All admin routes require authentication and admin role
router.use(authenticate, authorize('admin'));

// Dashboard stats
router.get('/dashboard', AdminController.getDashboardStats);

// User management
router.post('/users', 
  userValidationRules.register, 
  validateRequest, 
  AdminController.createUser
);

router.get('/users', AdminController.getAllUsers);
router.get('/users/:id', AdminController.getUserById);
router.put('/users/:id', AdminController.updateUser);
router.delete('/users/:id', AdminController.deleteUser);

// Store management
router.post('/stores', 
  userValidationRules.createStore, 
  validateRequest, 
  AdminController.createStore
);

router.get('/stores', AdminController.getAllStores);
router.get('/stores/:id', AdminController.getStoreById);
router.put('/stores/:id', AdminController.updateStore);
router.delete('/stores/:id', AdminController.deleteStore);

module.exports = router;