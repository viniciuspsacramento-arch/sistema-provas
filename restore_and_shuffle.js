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
        console.log('--- Restaurando e Embaralhando ---');

        // 1. Restaurar Q1 e Q2 (Exponencial)
        // Topic ID from Q153 is likely 21 (based on previous logs) but let's query Q153 to be sure or just use 21. 
        // Log said "Usando Topic ID: 21".
        const topicoId = 21;

        const q1Text = `Uma fábrica de cabos de fibra óptica identificou que os defeitos de fabricação ocorrem segundo um Processo de Poisson com uma taxa média de λ = 2 defeitos por quilômetro.

A variável aleatória X, que representa a distância entre dois defeitos consecutivos, segue uma distribuição Exponencial.

Qual é a probabilidade de que a distância entre dois defeitos consecutivos seja **MAIOR que 500 metros** (0,5 km)?`;

        const [res1] = await connection.query(
            'INSERT INTO questoes (topico_id, enunciado, dificuldade, tipo) VALUES (?, ?, ?, ?)',
            [topicoId, q1Text, 'medio', 'multipla_escolha']
        );
        const id1 = res1.insertId;
        console.log(`Restaurada Q1: ID ${id1}`);

        await connection.query('INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES ?', [[
            [id1, 'Aproximadamente 36,8% (P = 1/e).', true, 1],
            [id1, 'Aproximadamente 63,2% (P = 1 - 1/e).', false, 2],
            [id1, 'Aproximadamente 13,5% (P = 1/e²).', false, 3],
            [id1, 'Aproximadamente 0,7% (P = 1/e⁵).', false, 4],
            [id1, 'Aproximadamente 50,0%.', false, 5]
        ]]);

        const q2Text = `Um contador Geiger detecta partículas emitidas por uma fonte radioativa. As emissões seguem um Processo de Poisson com uma taxa média de λ = 6 partículas por segundo.

Seja T o tempo decorrido entre duas emissões consecutivas.

Qual a probabilidade de que o intervalo de tempo entre duas detecções seja **MENOR que 0,166... segundos** (ou seja, menos de 1/6 de segundo)?`;

        const [res2] = await connection.query(
            'INSERT INTO questoes (topico_id, enunciado, dificuldade, tipo) VALUES (?, ?, ?, ?)',
            [topicoId, q2Text, 'medio', 'multipla_escolha']
        );
        const id2 = res2.insertId;
        console.log(`Restaurada Q2: ID ${id2}`);

        await connection.query('INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES ?', [[
            [id2, 'Aproximadamente 63,2% (P = 1 - 1/e).', true, 1],
            [id2, 'Aproximadamente 36,8% (P = 1/e).', false, 2],
            [id2, 'Aproximadamente 86,5% (P = 1 - 1/e²).', false, 3],
            [id2, 'Aproximadamente 99,8%.', false, 4],
            [id2, 'Aproximadamente 9,0%.', false, 5]
        ]]);

        // 2. Embaralhar IDs recentes (156, 157, id1, id2)
        // Note: 156 and 157 were already shuffled but shuffling again is fine.
        const idsToShuffle = [156, 157, id1, id2];
        console.log(`Embaralhando: ${idsToShuffle.join(', ')}`);

        for (const qId of idsToShuffle) {
            const [alts] = await connection.query('SELECT id FROM alternativas WHERE questao_id = ?', [qId]);

            // Shuffle
            for (let i = alts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [alts[i], alts[j]] = [alts[j], alts[i]];
            }

            // Update
            for (let i = 0; i < alts.length; i++) {
                await connection.query('UPDATE alternativas SET ordem = ? WHERE id = ?', [i + 1, alts[i].id]);
            }
        }

        console.log('✅ Tudo pronto!');

    } catch (err) {
        console.error('Erro:', err);
    } finally {
        await connection.end();
    }
}

run();
