const db = require('../config/database');

class User {
  static async create(userData) {
    const { name, email, password, address, role } = userData;
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, address, role || 'normal_user']
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, address, role FROM users WHERE id = ?', 
      [id]
    );
    return rows[0];
  }

  static async findAll(filters = {}, sortBy = 'name', sortOrder = 'ASC') {
    let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
    const params = [];
    
    if (filters.name) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.name}%`);
    }
    if (filters.email) {
      query += ' AND email LIKE ?';
      params.push(`%${filters.email}%`);
    }
    if (filters.address) {
      query += ' AND address LIKE ?';
      params.push(`%${filters.address}%`);
    }
    if (filters.role) {
      query += ' AND role = ?';
      params.push(filters.role);
    }
    
    // Add sorting
    const validSortColumns = ['name', 'email', 'address', 'role'];
    if (validSortColumns.includes(sortBy)) {
      query += ` ORDER BY ${sortBy} ${sortOrder === 'DESC' ? 'DESC' : 'ASC'}`;
    }
    
    const [rows] = await db.query(query, params);
    return rows;
  }

  static async updatePassword(id, hashedPassword) {
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
  }

  static async count() {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM users');
    return rows[0].count;
  }
}

module.exports = User;