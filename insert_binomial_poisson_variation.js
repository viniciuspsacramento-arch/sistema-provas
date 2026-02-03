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
        console.log('--- Inserindo Variação Poisson/Binomial ---');
        const topicoId = 16;

        const enunciado = `Considere uma variável aleatória seguindo uma distribuição Binomial com parâmetros n=20 e p=0,4. Ao tentar aproximar as probabilidades dessa variável utilizando uma distribuição de Poisson com λ = n·p = 8, o resultado é considerado inadequado.

Assinale a alternativa que melhor justifica essa inadequação.`;

        // Insert Question
        const [res] = await connection.query(
            'INSERT INTO questoes (topico_id, enunciado, dificuldade, tipo) VALUES (?, ?, ?, ?)',
            [topicoId, enunciado, 'medio', 'multipla_escolha']
        );
        const qId = res.insertId;
        console.log(`Inserida ID: ${qId}`);

        // Alternatives
        const alternatives = [
            { t: 'A probabilidade de sucesso (p=0,4) é muito alta, violando a condição de evento raro; a variância da Poisson (8) é quase o dobro da variância real da Binomial (4,8).', c: true },
            { t: 'O valor de n=20 é muito pequeno; para que a Poisson funcione, o n deve ser sempre superior a 1000.', c: false },
            { t: 'A distribuição Binomial é simétrica para qualquer p, enquanto a Poisson é sempre assimétrica, impossibilitando a aproximação.', c: false },
            { t: 'A aproximação seria válida apenas se utilizássemos a correção de continuidade, somando 0,5 aos valores discretos.', c: false },
            { t: 'A média calculada λ=8 não é um número primo, o que impede a definição correta dos parâmetros da Poisson.', c: false }
        ];

        // Shuffle alternatives locally before inserting
        for (let i = alternatives.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [alternatives[i], alternatives[j]] = [alternatives[j], alternatives[i]];
        }

        // Prepare insert data
        const values = alternatives.map((alt, index) => [qId, alt.t, alt.c, index + 1]);

        await connection.query('INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES ?', [values]);

        console.log('✅ Questão inserida com sucesso e alternativas embaralhadas!');

    } catch (err) {
        console.error('Erro:', err);
    } finally {
        await connection.end();
    }
}

run();
