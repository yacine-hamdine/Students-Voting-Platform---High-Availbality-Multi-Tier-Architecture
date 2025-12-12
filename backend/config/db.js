const mysql = require('mysql2/promise');

// --- CRITICAL CONFIGURATION ---
const DB_ROUTER_HOST = '192.168.123.210';
const DB_MASTER_PORT = 6446;
const DB_SLAVE_PORT = 6447;

const db_config = {
    host: DB_ROUTER_HOST,
    user: 'repl_user',
    password: '1475963',
    database: 'voting_db'
};

// Create Pools for better performance
const masterPool = mysql.createPool({
    ...db_config,
    port: DB_MASTER_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const slavePool = mysql.createPool({
    ...db_config,
    port: DB_SLAVE_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log(`DB Configured: Master on ${DB_MASTER_PORT}, Slave on ${DB_SLAVE_PORT}`);

module.exports = { masterPool, slavePool };
