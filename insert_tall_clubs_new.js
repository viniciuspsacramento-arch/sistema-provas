const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'banco_questoes_estatistica'
    });

    try {
        console.log('--- Inserindo Questões Tall Clubs International ---');
        const topicoId = 19; // Distribuição Normal

        // --- QUESTÃO 1: Top 6.5% ---
        // Z(0.935) ~= 1.514
        // Men: 69 + 1.514*2.8 = 73.24
        // Women: 63.6 + 1.514*2.5 = 67.39
        const q1Text = `Se o Tall Clubs International decidisse alterar suas regras para aceitar apenas os 6,5% homens mais altos e as 6,5% mulheres mais altas, quais seriam, aproximadamente, as novas alturas mínimas exigidas?
        
Considere:
- Homens: N(69, 2.8)
- Mulheres: N(63.6, 2.5)`;

        const [res1] = await connection.query(
            'INSERT INTO questoes (topico_id, enunciado, dificuldade, tipo) VALUES (?, ?, ?, ?)',
            [topicoId, q1Text, 'medio', 'multipla_escolha']
        );
        const q1Id = res1.insertId;

        await connection.query('INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES ?', [[
            [q1Id, 'Homens: 73,24 pol; Mulheres: 67,39 pol.', true, 1],
            [q1Id, 'Homens: 72,15 pol; Mulheres: 66,20 pol.', false, 2],
            [q1Id, 'Homens: 74,50 pol; Mulheres: 68,10 pol.', false, 3],
            [q1Id, 'Homens: 70,25 pol; Mulheres: 65,00 pol.', false, 4],
            [q1Id, 'Homens: 75,00 pol; Mulheres: 69,00 pol.', false, 5]
        ]]);


        // --- QUESTÃO 2: Top 9% ---
        // Z(0.91) ~= 1.341
        // Men: 69 + 1.341*2.8 = 72.75
        // Women: 63.6 + 1.341*2.5 = 66.95
        const q2Text = `Se o Tall Clubs International decidisse alterar suas regras para aceitar apenas os 9% homens mais altos e as 9% mulheres mais altas, quais seriam, aproximadamente, as novas alturas mínimas exigidas?

Considere:
- Homens: N(69, 2.8)
- Mulheres: N(63.6, 2.5)`;

        const [res2] = await connection.query(
            'INSERT INTO questoes (topico_id, enunciado, dificuldade, tipo) VALUES (?, ?, ?, ?)',
            [topicoId, q2Text, 'medio', 'multipla_escolha']
        );
        const q2Id = res2.insertId;

        await connection.query('INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES ?', [[
            [q2Id, 'Homens: 72,75 pol; Mulheres: 66,95 pol.', true, 1],
            [q2Id, 'Homens: 73,50 pol; Mulheres: 67,50 pol.', false, 2],
            [q2Id, 'Homens: 71,20 pol; Mulheres: 65,80 pol.', false, 3],
            [q2Id, 'Homens: 74,10 pol; Mulheres: 68,20 pol.', false, 4],
            [q2Id, 'Homens: 70,90 pol; Mulheres: 64,10 pol.', false, 5]
        ]]);

        console.log(`Questões inseridas: ${q1Id}, ${q2Id}`);

    } catch (err) {
        console.error('Erro:', err);
    } finally {
        await connection.end();
    }
}

run();
