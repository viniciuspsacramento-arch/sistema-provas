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
        console.log('--- Inserindo Questões Análogas (Exponencial/Poisson) ---');

        // 1. Get topic from Q153
        const [rows] = await connection.query('SELECT topico_id FROM questoes WHERE id = 153');
        const topicoId = rows.length ? rows[0].topico_id : 1; // Fallback to 1
        console.log(`Usando Topic ID: ${topicoId}`);

        // --- QUESTÃO 1: Defeitos em Cabo (Fiber Optics) ---
        // Lambda = 2 defeitos/km. X > 0.5 km. P = e^-1
        const q1Text = `Uma fábrica de cabos de fibra óptica identificou que os defeitos de fabricação ocorrem segundo um Processo de Poisson com uma taxa média de λ = 2 defeitos por quilômetro.

A variável aleatória X, que representa a distância entre dois defeitos consecutivos, segue uma distribuição Exponencial.

Qual é a probabilidade de que a distância entre dois defeitos consecutivos seja **MAIOR que 500 metros** (0,5 km)?`;

        const [res1] = await connection.query(
            'INSERT INTO questoes (topico_id, enunciado, dificuldade, tipo) VALUES (?, ?, ?, ?)',
            [topicoId, q1Text, 'medio', 'multipla_escolha']
        );
        const q1Id = res1.insertId;
        console.log(`Questão 1 inserida (ID: ${q1Id})`);

        await connection.query('INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES ?', [[
            [q1Id, 'Aproximadamente 36,8% (P = 1/e).', true, 1],
            [q1Id, 'Aproximadamente 63,2% (P = 1 - 1/e).', false, 2],
            [q1Id, 'Aproximadamente 13,5% (P = 1/e²).', false, 3],
            [q1Id, 'Aproximadamente 0,7% (P = 1/e⁵).', false, 4],
            [q1Id, 'Aproximadamente 50,0%.', false, 5]
        ]]);


        // --- QUESTÃO 2: Partículas Radioativas ---
        // Lambda = 6 particulas/segundo. T < 1/6 s. P = 1 - e^-1
        const q2Text = `Um contador Geiger detecta partículas emitidas por uma fonte radioativa. As emissões seguem um Processo de Poisson com uma taxa média de λ = 6 partículas por segundo.

Seja T o tempo decorrido entre duas emissões consecutivas.

Qual a probabilidade de que o intervalo de tempo entre duas detecções seja **MENOR que 0,166... segundos** (ou seja, menos de 1/6 de segundo)?`;

        const [res2] = await connection.query(
            'INSERT INTO questoes (topico_id, enunciado, dificuldade, tipo) VALUES (?, ?, ?, ?)',
            [topicoId, q2Text, 'medio', 'multipla_escolha']
        );
        const q2Id = res2.insertId;
        console.log(`Questão 2 inserida (ID: ${q2Id})`);

        await connection.query('INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES ?', [[
            [q2Id, 'Aproximadamente 63,2% (P = 1 - 1/e).', true, 1],
            [q2Id, 'Aproximadamente 36,8% (P = 1/e).', false, 2],
            [q2Id, 'Aproximadamente 86,5% (P = 1 - 1/e²).', false, 3],
            [q2Id, 'Aproximadamente 99,8%.', false, 4],
            [q2Id, 'Aproximadamente 9,0%.', false, 5]
        ]]);

        console.log('✅ Questões inseridas com sucesso!');

    } catch (err) {
        console.error('Erro:', err);
    } finally {
        await connection.end();
    }
}

run();
