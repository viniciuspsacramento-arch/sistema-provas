const mysql = require('mysql2/promise');
require('dotenv').config();

async function shuffleAll() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'banco_questoes_estatistica'
    });

    try {
        console.log('--- Embaralhando TODAS as alternativas do banco ---');

        // 1. Get all questions IDs
        const [questoes] = await connection.query('SELECT id FROM questoes');
        console.log(`Encontradas ${questoes.length} questões.`);

        for (const q of questoes) {
            // 2. Get alternatives
            const [alts] = await connection.query('SELECT id, texto FROM alternativas WHERE questao_id = ?', [q.id]);

            if (alts.length < 2) continue; // Skip if no alternatives

            // 3. Shuffle (Fisher-Yates)
            for (let i = alts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [alts[i], alts[j]] = [alts[j], alts[i]];
            }

            // 4. Update order
            for (let i = 0; i < alts.length; i++) {
                await connection.query('UPDATE alternativas SET ordem = ? WHERE id = ?', [i + 1, alts[i].id]);
            }
        }

        console.log('✅ Todas as questões foram re-embaralhadas!');

    } catch (err) {
        console.error('Erro:', err);
    } finally {
        await connection.end();
    }
}

shuffleAll();
