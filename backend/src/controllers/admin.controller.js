const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const Store = require('../models/Store.model');
const Rating = require('../models/Rating.model');

class AdminController {
  // Dashboard stats
  static async getDashboardStats(req, res, next) {
    try {
      const [totalUsers, totalStores, totalRatings] = await Promise.all([
        User.count(),
        Store.count(),
        Rating.count()
      ]);

      res.json({
        totalUsers,
        totalStores,
        totalRatings
      });
    } catch (error) {
      next(error);
    }
  }

  // User management
  static async createUser(req, res, next) {
    try {
      const { name, email, password, address, role } = req.body;

      // Check if user exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userId = await User.create({ 
        name, 
        email, 
        password: hashedPassword, 
        address, 
        role 
      });

      // Get created user
      const user = await User.findById(userId);

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const { name, email, address, role, sortBy, sortOrder } = req.query;
      
      const filters = { name, email, address, role };
      const users = await User.findAll(filters, sortBy, sortOrder);
      
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If user is store owner, get their average rating
      if (user.role === 'store_owner') {
        const stores = await Store.findByOwnerId(id);
        if (stores.length > 0) {
          const storeIds = stores.map(s => s.id);
          const [ratingResult] = await req.app.locals.db.query(
            `SELECT COALESCE(AVG(r.rating), 0) as average_rating
             FROM ratings r
             WHERE r.store_id IN (?)`,
            [storeIds]
          );
          user.averageRating = parseFloat(ratingResult[0].average_rating).toFixed(1);
        } else {
          user.averageRating = '0.0';
        }
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, address, role } = req.body;
      const db = req.app.locals.db;

      // Check if user exists
      const [existingUser] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
      if (existingUser.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if email is already taken by another user
      if (email) {
        const [emailCheck] = await db.query(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [email, id]
        );
        if (emailCheck.length > 0) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      // Update user
      await db.query(
        'UPDATE users SET name = ?, email = ?, address = ?, role = ? WHERE id = ?',
        [name, email, address, role, id]
      );

      const [updatedUser] = await db.query(
        'SELECT id, name, email, address, role FROM users WHERE id = ?',
        [id]
      );

      res.json(updatedUser[0]);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const db = req.app.locals.db;

      // Check if user exists
      const [existingUser] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
      if (existingUser.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Don't allow deleting yourself
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }

      // Delete user (ratings will be cascaded)
      await db.query('DELETE FROM users WHERE id = ?', [id]);

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Store management
  static async createStore(req, res, next) {
    try {
      const { name, email, address, owner_id } = req.body;

      // Validate owner exists and is store owner
      if (owner_id) {
        const owner = await User.findById(owner_id);
        if (!owner || owner.role !== 'store_owner') {
          return res.status(400).json({ message: 'Invalid store owner' });
        }
      }

      // Create store
      const storeId = await Store.create({ name, email, address, owner_id });
      
      // Get created store
      const [store] = await req.app.locals.db.query(
        'SELECT * FROM stores WHERE id = ?', 
        [storeId]
      );

      res.status(201).json(store[0]);
    } catch (error) {
      next(error);
    }
  }

  static async getAllStores(req, res, next) {
    try {
      const { name, email, address, sortBy, sortOrder } = req.query;
      
      const filters = { name, email, address };
      const stores = await Store.findAllWithFilters(filters, sortBy, sortOrder);
      
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
      const db = req.app.locals.db;

      const [stores] = await db.query(
        `SELECT s.*, 
                COALESCE(AVG(r.rating), 0) as average_rating,
                COUNT(r.id) as total_ratings
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.id = ?
         GROUP BY s.id`,
        [id]
      );

      if (stores.length === 0) {
        return res.status(404).json({ message: 'Store not found' });
      }

      const store = stores[0];
      store.average_rating = parseFloat(store.average_rating).toFixed(1);

      res.json(store);
    } catch (error) {
      next(error);
    }
  }

  static async updateStore(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, address, owner_id } = req.body;
      const db = req.app.locals.db;

      // Check if store exists
      const [existingStore] = await db.query('SELECT id FROM stores WHERE id = ?', [id]);
      if (existingStore.length === 0) {
        return res.status(404).json({ message: 'Store not found' });
      }

      // Check if email is already taken by another store
      if (email) {
        const [emailCheck] = await db.query(
          'SELECT id FROM stores WHERE email = ? AND id != ?',
          [email, id]
        );
        if (emailCheck.length > 0) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      // Validate owner exists and is store owner
      if (owner_id) {
        const [ownerResult] = await db.query(
          'SELECT role FROM users WHERE id = ?',
          [owner_id]
        );
        if (ownerResult.length === 0 || ownerResult[0].role !== 'store_owner') {
          return res.status(400).json({ message: 'Invalid store owner' });
        }
      }

      // Update store
      await db.query(
        'UPDATE stores SET name = ?, email = ?, address = ?, owner_id = ? WHERE id = ?',
        [name, email, address, owner_id || null, id]
      );

      const [updatedStore] = await db.query('SELECT * FROM stores WHERE id = ?', [id]);

      res.json(updatedStore[0]);
    } catch (error) {
      next(error);
    }
  }

  static async deleteStore(req, res, next) {
    try {
      const { id } = req.params;
      const db = req.app.locals.db;

      // Check if store exists
      const [existingStore] = await db.query('SELECT id FROM stores WHERE id = ?', [id]);
      if (existingStore.length === 0) {
        return res.status(404).json({ message: 'Store not found' });
      }

      // Delete store (ratings will be cascaded)
      await db.query('DELETE FROM stores WHERE id = ?', [id]);

      res.json({ message: 'Store deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;