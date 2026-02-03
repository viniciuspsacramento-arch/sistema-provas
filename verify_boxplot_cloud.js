const mysql = require('mysql2/promise');

const CLOUD_DB_URL = 'mysql://root:DnfWVyYtTnGNnbwKlKbqegCOZeTvSlin@gondola.proxy.rlwy.net:25921/railway';

async function run() {
    console.log('--- Verifying Boxplot Questions ---');
    const connection = await mysql.createConnection({
        uri: CLOUD_DB_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const enunciado1 = `Analise o Box Plot abaixo, que representa a distribuição de salários em uma startup de tecnologia`;
        const enunciado2 = `Considere os Box Plots das Máquinas A e B abaixo, que representam o tempo de operação`;
        const enunciado3 = `Em um conjunto de dados, o "Resumo dos 5 Números" é: Mínimo=10, Q1=30, Mediana=40, Q3=50, Máximo=120`;

        const [r1] = await connection.query('SELECT id FROM questoes WHERE enunciado LIKE ?', [enunciado1.substring(0, 50) + '%']);
        const [r2] = await connection.query('SELECT id FROM questoes WHERE enunciado LIKE ?', [enunciado2.substring(0, 50) + '%']);
        const [r3] = await connection.query('SELECT id FROM questoes WHERE enunciado LIKE ?', [enunciado3.substring(0, 50) + '%']);

        console.log(`Q1 Boxplot Found: ${r1.length > 0 ? 'YES' : 'NO'}`);
        console.log(`Q2 Boxplot Found: ${r2.length > 0 ? 'YES' : 'NO'}`);
        console.log(`Q3 Boxplot Found: ${r3.length > 0 ? 'YES' : 'NO'}`);

    } catch (err) {
        console.error('Erro:', err);
    } finally {
        await connection.end();
    }
}

run();
