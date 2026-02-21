const db = require('../config/database');

class Rating {
  static async createOrUpdate(userId, storeId, rating) {
    // Check if rating exists
    const [existing] = await db.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (existing.length > 0) {
      // Update existing rating
      await db.query(
        'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
        [rating, userId, storeId]
      );
      return { id: existing[0].id, user_id: userId, store_id: storeId, rating };
    } else {
      // Create new rating
      const [result] = await db.query(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
        [userId, storeId, rating]
      );
      return { id: result.insertId, user_id: userId, store_id: storeId, rating };
    }
  }

  static async getUserRating(userId, storeId) {
    const [rows] = await db.query(
      'SELECT rating FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );
    return rows[0]?.rating;
  }

  static async getUserRatings(userId) {
    const [rows] = await db.query(
      `SELECT r.*, s.name as store_name, s.address as store_address
       FROM ratings r
       JOIN stores s ON r.store_id = s.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async getStoreRatings(storeId) {
    const [rows] = await db.query(
      `SELECT r.*, u.name as user_name, u.email as user_email
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [storeId]
    );
    return rows;
  }

  static async count() {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM ratings');
    return rows[0].count;
  }
}

module.exports = Rating;