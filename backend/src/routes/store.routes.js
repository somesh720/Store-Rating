const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const StoreController = require('../controllers/store.controller');

// Public route - get all stores (with optional search)
router.get('/', StoreController.getAllStores);

// Protected routes
router.get('/owner/dashboard', authenticate, StoreController.getOwnerDashboard);
router.get('/:id', authenticate, StoreController.getStoreById);

module.exports = router;