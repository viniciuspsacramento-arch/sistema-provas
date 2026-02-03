const mysql = require('mysql2/promise');

// Cloud URL
const CLOUD_DB_URL = 'mysql://root:DnfWVyYtTnGNnbwKlKbqegCOZeTvSlin@gondola.proxy.rlwy.net:25921/railway';

async function run() {
    console.log('--- Connecting to Cloud DB ---');
    const connection = await mysql.createConnection({
        uri: CLOUD_DB_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('--- Inserindo Variação Poisson/Binomial (Cloud) ---');
        // ID 16 is Poisson (from previous list)
        // 16: Distribuição de Probabilidade (Poisson)
        const topicoId = 16;

        const enunciado = `Considere uma variável aleatória seguindo uma distribuição Binomial com parâmetros n=20 e p=0,4. Ao tentar aproximar as probabilidades dessa variável utilizando uma distribuição de Poisson com λ = n·p = 8, o resultado é considerado inadequado.

Assinale a alternativa que melhor justifica essa inadequação.`;

        // Check if exists first to avoid dupes?
        // Simple check
        const [rows] = await connection.query('SELECT id FROM questoes WHERE enunciado = ?', [enunciado]);
        if (rows.length > 0) {
            console.log('Questão já existe. Pulando.');
            return;
        }

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

        // Shuffle alternatives
        for (let i = alternatives.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [alternatives[i], alternatives[j]] = [alternatives[j], alternatives[i]];
        }

        // Prepare insert data
        const values = alternatives.map((alt, index) => [qId, alt.t, alt.c, index + 1]);

        await connection.query('INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES ?', [values]);

        console.log('✅ Questão inserida com sucesso!');

    } catch (err) {
        console.error('Erro:', err);
    } finally {
        await connection.end();
    }
}

run();
