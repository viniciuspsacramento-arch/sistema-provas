const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugSave() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'banco_questoes_estatistica'
    });

    try {
        console.log('--- Debug Save/Update Prova ---');

        // 1. Setup: Pegar algumas questões
        const [qRes] = await connection.query('SELECT id FROM questoes LIMIT 5');
        if (qRes.length < 2) return console.log('Poucas questões para teste.');
        const qContent = qRes.map(q => q.id); // Array de IDs
        console.log('IDs das questões:', qContent);

        // 2. Simular POST (Create)
        console.log('\nTentando criar prova (POST)...');
        await connection.beginTransaction();
        try {
            const [resCreate] = await connection.query(
                'INSERT INTO provas (titulo, descricao) VALUES (?, ?)',
                ['Prova Debug', 'Teste Debug']
            );
            const provaId = resCreate.insertId;
            console.log(`Prova criada com ID: ${provaId}`);

            for (let i = 0; i < qContent.length; i++) {
                await connection.query(
                    'INSERT INTO provas_questoes (prova_id, questao_id, ordem) VALUES (?, ?, ?)',
                    [provaId, qContent[i], i + 1]
                );
            }
            await connection.commit();
            console.log('✅ POST sucesso.');

            // 3. Simular PUT (Update)
            console.log('\nTentando atualizar prova (PUT)...');
            await connection.beginTransaction();

            // Delete existing
            await connection.query('DELETE FROM provas_questoes WHERE prova_id = ?', [provaId]);

            // Re-insert (simulate reorder or same)
            // Vamos tentar inserir apenas as 2 primeiras
            const newQuestions = [qContent[0], qContent[1]];
            for (let i = 0; i < newQuestions.length; i++) {
                await connection.query(
                    'INSERT INTO provas_questoes (prova_id, questao_id, ordem) VALUES (?, ?, ?)',
                    [provaId, newQuestions[i], i + 1]
                );
            }

            await connection.commit();
            console.log('✅ PUT sucesso.');

            // Clean up
            await connection.query('DELETE FROM provas WHERE id = ?', [provaId]);

        } catch (innerErr) {
            await connection.rollback();
            throw innerErr;
        }

    } catch (err) {
        console.error('❌ ERRO:', err);
    } finally {
        await connection.end();
    }
}

debugSave();
