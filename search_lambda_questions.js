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
            SELECT id, enunciado 
            FROM questoes 
            WHERE enunciado LIKE '%lambda%' 
               OR enunciado LIKE '%distribuição exponencial%' 
               OR enunciado LIKE '%Poisson%'
            LIMIT 10
        `);

        console.log('--- Questões Encontradas ---');
        rows.forEach(r => {
            console.log(`ID: ${r.id}`);
            console.log(`Enunciado: ${r.enunciado.substring(0, 150)}...`);
            console.log('---');
        });

    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

search();
