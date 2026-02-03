const mysql = require('mysql2/promise');
require('dotenv').config();

async function analyze() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'banco_questoes_estatistica'
    });

    try {
        console.log('--- Análise de Distribuição das Respostas Corretas ---');

        const [rows] = await connection.query(`
            SELECT q.id, a.ordem
            FROM questoes q
            JOIN alternativas a ON q.id = a.questao_id
            WHERE a.correta = 1
        `);

        const distribution = {};
        rows.forEach(r => {
            distribution[r.ordem] = (distribution[r.ordem] || 0) + 1;
        });

        console.log('Frequência da posição da resposta correta:');
        console.table(distribution);

        const total = rows.length;
        const pos1 = distribution['1'] || 0;
        console.log(`Total: ${total}`);
        console.log(`Posição 1 (A): ${pos1} (${((pos1 / total) * 100).toFixed(1)}%)`);

    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

analyze();
