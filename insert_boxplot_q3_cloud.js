const mysql = require('mysql2/promise');

const CLOUD_DB_URL = 'mysql://root:DnfWVyYtTnGNnbwKlKbqegCOZeTvSlin@gondola.proxy.rlwy.net:25921/railway';

async function run() {
    console.log('--- Inserting Boxplot Q3 (JS) ---');
    const connection = await mysql.createConnection({
        uri: CLOUD_DB_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        // TOPIC ID 20: Estatística descritiva
        const topicoId = 20;

        const enunciado = `Em um conjunto de dados, o "Resumo dos 5 Números" é: Mínimo=10, Q1=30, Mediana=40, Q3=50, Máximo=120. Utilize as distâncias entre os quartis (Q2 - Q1 vs Q3 - Q2) e as distâncias dos extremos (Q1 - Min vs Max - Q3) para diagnosticar a simetria da distribuição. Qual a conclusão correta?`;

        // Check exists
        const [exist] = await connection.query('SELECT id FROM questoes WHERE enunciado LIKE ?', [enunciado.substring(0, 50) + '%']);
        if (exist.length > 0) {
            console.log('Questão Q3 já existe. Pulando.');
        } else {
            const [res] = await connection.query(
                'INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES (?, ?, ?, ?, ?)',
                [enunciado, topicoId, 'dificil', 'multipla_escolha', 0]
            );
            const qid = res.insertId;
            console.log(`Questão Q3 inserida: ID ${qid}`);

            const alts = [
                { t: 'A distribuição é fortemente assimétrica à direita (positiva), pois a distância do bigode superior (120-50=70) é muito maior que a do inferior (30-10=20).', c: true },
                { t: 'A distribuição é simétrica, pois a distância Q2-Q1 (10) é igual à distância Q3-Q2 (10).', c: false },
                { t: 'A distribuição é assimétrica à esquerda, pois a mediana está mais próxima de Q3.', c: false },
                { t: 'A distribuição é bimodal, dado o grande intervalo total.', c: false },
                { t: 'Não há evidência de assimetria, pois a mediana é exatamente a média de Q1 e Q3.', c: false }
            ];

            const values = alts.map((a, i) => [qid, a.t, a.c, i + 1]);
            await connection.query('INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES ?', [values]);
        }

        console.log('✅ Sucesso!');

    } catch (err) {
        console.error('❌ Erro:', err);
    } finally {
        await connection.end();
    }
}

run();
