const mysql = require('mysql2/promise');
require('dotenv').config();

async function cleanup() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'banco_questoes_estatistica'
    });

    console.log('Iniciando limpeza de tópicos duplicados...');

    try {
        // Obter todos os tópicos
        const [topics] = await connection.query('SELECT id, nome FROM topicos ORDER BY id ASC');

        // Agrupar por nome
        const topicMap = {};
        for (const t of topics) {
            const name = t.nome; // Normalização exata (case sensitive para SQL default, mas varia. Vamos assumir igual)
            if (!topicMap[name]) {
                topicMap[name] = [];
            }
            topicMap[name].push(t.id);
        }

        // Processar duplicatas
        for (const name in topicMap) {
            const ids = topicMap[name];
            if (ids.length > 1) {
                const masterId = ids[0];
                const duplicateIds = ids.slice(1);

                console.log(`Tópico '${name}' tem duplicatas: [${ids.join(', ')}]. Mantendo ${masterId}.`);

                // Atualizar questões para apontar para o masterId
                const [updateResult] = await connection.query(
                    `UPDATE questoes SET topico_id = ? WHERE topico_id IN (${duplicateIds.join(',')})`,
                    [masterId]
                );
                console.log(`  - ${updateResult.affectedRows} questões migradas para o tópico ID ${masterId}.`);

                // Deletar tópicos duplicados
                const [deleteResult] = await connection.query(
                    `DELETE FROM topicos WHERE id IN (${duplicateIds.join(',')})`
                );
                console.log(`  - ${deleteResult.affectedRows} tópicos duplicados removidos.`);
            }
        }

        console.log('Limpeza concluída com sucesso!');

    } catch (error) {
        console.error('Erro na limpeza:', error);
    } finally {
        await connection.end();
    }
}

cleanup();
