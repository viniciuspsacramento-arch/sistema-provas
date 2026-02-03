const mysql = require('mysql2/promise');
require('dotenv').config();

async function shuffle() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'banco_questoes_estatistica'
    });

    try {
        console.log('--- Embaralhando Alternativas (IDs >= 154) ---');

        // 1. Get IDs of recent questions
        const [questoes] = await connection.query('SELECT id FROM questoes WHERE id >= 154');

        for (const q of questoes) {
            // 2. Get alternatives
            const [alts] = await connection.query('SELECT id, texto FROM alternativas WHERE questao_id = ?', [q.id]);

            // 3. Shuffle (Fisher-Yates)
            for (let i = alts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [alts[i], alts[j]] = [alts[j], alts[i]];
            }

            // 4. Update order
            for (let i = 0; i < alts.length; i++) {
                await connection.query('UPDATE alternativas SET ordem = ? WHERE id = ?', [i + 1, alts[i].id]);
            }
            console.log(`Questão ${q.id}: Alternativas embaralhadas.`);
        }

        console.log('✅ Concluído!');

    } catch (err) {
        console.error('Erro:', err);
    } finally {
        await connection.end();
    }
}

shuffle();
