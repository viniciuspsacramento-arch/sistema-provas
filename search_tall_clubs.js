const mysql = require('mysql2/promise');
require('dotenv').config();

async function search() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'banco_questoes_estatistica'
    });

    try {
        const [rows] = await connection.query(`
            SELECT id, topico_id, enunciado 
            FROM questoes 
            WHERE enunciado LIKE '%Tall Clubs%'
            LIMIT 1
        `);

        if (rows.length > 0) {
            console.log(`Encontrada ID: ${rows[0].id}, Topico: ${rows[0].topico_id}`);
            console.log(rows[0].enunciado);
        } else {
            console.log('Não encontrada.');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

search();
