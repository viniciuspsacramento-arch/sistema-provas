const mysql = require('mysql2/promise');
require('dotenv').config();

async function viewQuestion() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'banco_questoes_estatistica'
    });

    try {
        const [rows] = await connection.query(`
            SELECT q.enunciado, a.texto, a.correta 
            FROM questoes q
            JOIN alternativas a ON q.id = a.questao_id
            WHERE q.id = 153
        `);

        console.log('ENUNCIADO:', rows[0].enunciado);
        console.log('\nALTERNATIVAS:');
        rows.forEach(r => {
            console.log(`[${r.correta ? 'x' : ' '}] ${r.texto}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

viewQuestion();
