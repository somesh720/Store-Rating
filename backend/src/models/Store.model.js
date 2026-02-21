const db = require('../config/database');

class Store {
  static async create(storeData) {
    const { name, email, address, owner_id } = storeData;
    const [result] = await db.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id || null]
    );
    return result.insertId;
  }

  static async findAllWithFilters(filters = {}, sortBy = 'name', sortOrder = 'ASC') {
    let query = `
      SELECT s.*, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [];
    
    if (filters.name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${filters.name}%`);
    }
    if (filters.email) {
      query += ' AND s.email LIKE ?';
      params.push(`%${filters.email}%`);
    }
    if (filters.address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${filters.address}%`);
    }
    
    query += ' GROUP BY s.id';
    
    // Add sorting
    const validSortColumns = ['name', 'email', 'address'];
    if (validSortColumns.includes(sortBy)) {
      query += ` ORDER BY s.${sortBy} ${sortOrder === 'DESC' ? 'DESC' : 'ASC'}`;
    }
    
    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findAll(search = '') {
    let query = `
      SELECT s.*, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    const params = [];
    
    if (search) {
      query += ' WHERE s.name LIKE ? OR s.address LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' GROUP BY s.id ORDER BY s.name';
    
    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM stores WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByIdWithRating(id, userId = null) {
    let query = `
      SELECT s.*, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = ?
      GROUP BY s.id
    `;
    
    const [rows] = await db.query(query, [id]);
    const store = rows[0];
    
    if (store && userId) {
      const [userRating] = await db.query(
        'SELECT rating FROM ratings WHERE user_id = ? AND store_id = ?',
        [userId, id]
      );
      store.user_rating = userRating[0]?.rating || null;
    }
    
    return store;
  }

  static async findByOwnerId(ownerId) {
    const [rows] = await db.query('SELECT id, name FROM stores WHERE owner_id = ?', [ownerId]);
    return rows;
  }

  static async getOwnerDashboard(ownerId) {
    // Get owner's stores
    const stores = await this.findByOwnerId(ownerId);
    const storeIds = stores.map(s => s.id);

    if (storeIds.length === 0) {
      return { stores: [], averageRating: 0, ratings: [] };
    }

    // Get average rating for all stores
    const [avgResult] = await db.query(
      `SELECT COALESCE(AVG(rating), 0) as average_rating
       FROM ratings
       WHERE store_id IN (?)`,
      [storeIds]
    );

    // Get all ratings with user details
    const [ratings] = await db.query(
      `SELECT r.*, u.name as user_name, u.email as user_email, s.name as store_name
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       JOIN stores s ON r.store_id = s.id
       WHERE r.store_id IN (?)
       ORDER BY r.created_at DESC`,
      [storeIds]
    );

    return {
      stores,
      averageRating: parseFloat(avgResult[0].average_rating).toFixed(1),
      ratings
    };
  }

  static async count() {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM stores');
    return rows[0].count;
  }
}

module.exports = Store;