const mysql = require('mysql2/promise');
require('dotenv').config();

function poisson(k, lambda) {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function factorial(n) {
    if (n === 0) return 1;
    let res = 1;
    for (let i = 1; i <= n; i++) res *= i;
    return res;
}

async function run() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'banco_questoes_estatistica'
    });

    try {
        console.log('--- Inserindo Questões Poisson Reverso ---');
        const topicoId = 16;

        // --- QUESTÃO 1: Lambda = 7.5 ---
        const lambda1 = 7.5;
        const p0_1 = poisson(0, lambda1).toFixed(4).replace('.', ',');
        const p1_1 = poisson(1, lambda1).toFixed(4).replace('.', ',');
        const p2_1 = poisson(2, lambda1).toFixed(4).replace('.', ',');

        const q1Text = `Uma central de atendimento de emergência recebe chamadas de acordo com um Processo de Poisson. Após análise dos registros, foram calculadas as seguintes probabilidades para o número de chamadas por minuto: P(X=0) = ${p0_1}; P(X=1) = ${p1_1}; P(X=2) = ${p2_1}. Com base nessas informações, qual é o valor aproximado da taxa média (λ) de chamadas por minuto?`;

        // --- QUESTÃO 2: Lambda = 3.2 ---
        const lambda2 = 3.2;
        const p0_2 = poisson(0, lambda2).toFixed(4).replace('.', ',');
        const p1_2 = poisson(1, lambda2).toFixed(4).replace('.', ',');
        const p2_2 = poisson(2, lambda2).toFixed(4).replace('.', ',');

        const q2Text = `Uma máquina industrial produz peças defeituosas seguindo uma distribuição de Poisson. Ao monitorar a produção por hora, observou-se: P(X=0) = ${p0_2}; P(X=1) = ${p1_2}; P(X=2) = ${p2_2}. Com base nesses dados, qual é a taxa média (λ) de defeitos por hora?`;

        // Insert Q1
        const [res1] = await connection.query(
            'INSERT INTO questoes (topico_id, enunciado, dificuldade, tipo) VALUES (?, ?, ?, ?)',
            [topicoId, q1Text, 'medio', 'multipla_escolha']
        );
        const id1 = res1.insertId;
        console.log(`Inserida Q1 (Lambda=7.5): ID ${id1}`);
        console.log(`Probabilidades: P(0)=${p0_1}, P(1)=${p1_1}, P(2)=${p2_1}`);

        await connection.query('INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES ?', [[
            [id1, 'λ = 7,5', true, 1],
            [id1, 'λ = 5,0', false, 2],
            [id1, 'λ = 8,2', false, 3],
            [id1, 'λ = 6,8', false, 4],
            [id1, 'λ = 9,0', false, 5]
        ]]);

        // Insert Q2
        const [res2] = await connection.query(
            'INSERT INTO questoes (topico_id, enunciado, dificuldade, tipo) VALUES (?, ?, ?, ?)',
            [topicoId, q2Text, 'medio', 'multipla_escolha']
        );
        const id2 = res2.insertId;
        console.log(`Inserida Q2 (Lambda=3.2): ID ${id2}`);
        console.log(`Probabilidades: P(0)=${p0_2}, P(1)=${p1_2}, P(2)=${p2_2}`);

        await connection.query('INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES ?', [[
            [id2, 'λ = 3,2', true, 1],
            [id2, 'λ = 2,5', false, 2],
            [id2, 'λ = 4,0', false, 3],
            [id2, 'λ = 1,8', false, 4],
            [id2, 'λ = 3,8', false, 5]
        ]]);

        // Shuffle Answers
        const idsToShuffle = [id1, id2];
        for (const qId of idsToShuffle) {
            const [alts] = await connection.query('SELECT id FROM alternativas WHERE questao_id = ?', [qId]);
            for (let i = alts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [alts[i], alts[j]] = [alts[j], alts[i]];
            }
            for (let i = 0; i < alts.length; i++) {
                await connection.query('UPDATE alternativas SET ordem = ? WHERE id = ?', [i + 1, alts[i].id]);
            }
        }

        console.log('✅ Questões inseridas e embaralhadas!');

    } catch (err) {
        console.error('Erro:', err);
    } finally {
        await connection.end();
    }
}

run();
