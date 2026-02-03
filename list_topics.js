const mysql = require('mysql2/promise');
require('dotenv').config();

async function listTopics() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'banco_questoes_estatistica'
    });

    const [rows] = await connection.query('SELECT id, nome FROM topicos ORDER BY nome');
    console.log(JSON.stringify(rows, null, 2));
    await connection.end();
}

listTopics();
