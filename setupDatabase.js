const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await connection.query('CREATE DATABASE IF NOT EXISTS news_aggregator');
    await connection.query('USE news_aggregator');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        source VARCHAR(100),
        published_at DATETIME,
        url VARCHAR(255)
      )
    `);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS historical_news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id VARCHAR(255),
        title VARCHAR(255),
        date DATE,
        content TEXT
      )
    `);
    console.log('Database and tables created successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await connection.end();
  }
}

setupDatabase();
