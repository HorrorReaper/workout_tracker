import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '90BNQtOsEsXoH42HIxFX',
    database: 'workout_tracker',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;