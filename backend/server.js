const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { masterPool } = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://192.168.123.210:5173'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/votes', require('./routes/voteRoutes'));

// Database Initialization
const initDB = async () => {
    let connection;
    try {
        console.log('Attempting to initialize database tables...');
        connection = await masterPool.getConnection();

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'student'
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS votes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                candidate VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Database tables initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize DB tables (This might be expected if using a pre-configured remote DB):', error.message);
    } finally {
        if (connection) connection.release();
    }
};

initDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
