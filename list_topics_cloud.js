const mysql = require('mysql2/promise');

// Cloud URL
const CLOUD_DB_URL = 'mysql://root:DnfWVyYtTnGNnbwKlKbqegCOZeTvSlin@gondola.proxy.rlwy.net:25921/railway';

async function listTopics() {
    let connection;
    try {
        connection = await mysql.createConnection(CLOUD_DB_URL);
        const [rows] = await connection.query('SELECT id, nome FROM topicos');
        console.log('--- Tópicos no Banco ---');
        rows.forEach(r => console.log(`${r.id}: ${r.nome}`));
    } catch (err) {
        console.error('Erro:', err);
    } finally {
        if (connection) await connection.end();
    }
}

listTopics();
