const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function setupDatabase() {
  let connection;
  
  try {
    // Connect without database selected
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    console.log('Connected to MySQL');

    // Read schema file
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, '../models/complete_db.sql'),
      'utf8'
    );

  

    // Execute schema
    console.log('Creating database schema...');
    await connection.query(schemaSQL);
    console.log('Schema created successfully');

    

    console.log('Database setup complete!');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();