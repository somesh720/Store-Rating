const Store = require('../models/Store.model');
const Rating = require('../models/Rating.model');

class StoreController {
  static async getAllStores(req, res, next) {
    try {
      const { search } = req.query;
      const stores = await Store.findAll(search || '');
      
      // Format average rating
      stores.forEach(store => {
        store.average_rating = parseFloat(store.average_rating).toFixed(1);
      });

      res.json(stores);
    } catch (error) {
      next(error);
    }
  }

  static async getStoreById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      const store = await Store.findByIdWithRating(id, userId);
      
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }

      store.average_rating = parseFloat(store.average_rating).toFixed(1);

      res.json(store);
    } catch (error) {
      next(error);
    }
  }

  static async getOwnerDashboard(req, res, next) {
    try {
      if (req.user.role !== 'store_owner') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const ownerId = req.user.id;
      const dashboard = await Store.getOwnerDashboard(ownerId);

      res.json(dashboard);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StoreController;