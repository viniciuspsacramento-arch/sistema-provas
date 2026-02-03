const mysql = require('mysql2/promise');
require('dotenv').config();

async function findDuplicates() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'banco_questoes_estatistica'
    });

    console.log('Buscando questões duplicadas...');

    try {
        // Encontrar duplicatas por enunciado (texto)
        const [textDuplicates] = await connection.query(`
            SELECT enunciado, COUNT(*) as qtd, GROUP_CONCAT(id) as ids
            FROM questoes
            WHERE enunciado IS NOT NULL
            GROUP BY enunciado
            HAVING qtd > 1
        `);

        if (textDuplicates.length > 0) {
            console.log('\n--- Duplicatas por texto (Enunciado) ---');
            textDuplicates.forEach(d => {
                const ids = d.ids.split(',').map(Number).sort((a, b) => a - b);
                console.log(`[${d.qtd}x] IDs: ${ids.join(', ')}`);
                console.log(`Texto: "${d.enunciado.substring(0, 100)}..."`);
                console.log('---');
            });
        }

        // Encontrar duplicatas por imagem (enunciado_imagem)
        const [imageDuplicates] = await connection.query(`
            SELECT enunciado_imagem, COUNT(*) as qtd, GROUP_CONCAT(id) as ids
            FROM questoes
            WHERE enunciado_imagem IS NOT NULL
            GROUP BY enunciado_imagem
            HAVING qtd > 1
        `);

        if (imageDuplicates.length > 0) {
            console.log('\n--- Duplicatas por imagem (Caminho) ---');
            imageDuplicates.forEach(d => {
                const ids = d.ids.split(',').map(Number).sort((a, b) => a - b);
                console.log(`[${d.qtd}x] IDs: ${ids.join(', ')}`);
                console.log(`Imagem: "${d.enunciado_imagem}"`);
                console.log('---');
            });
        }

        if (textDuplicates.length === 0 && imageDuplicates.length === 0) {
            console.log('Nenhuma duplicata encontrada.');
        }

    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await connection.end();
    }
}

findDuplicates();
