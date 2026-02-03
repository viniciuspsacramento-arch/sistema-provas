const mysql = require('mysql2/promise');
require('dotenv').config();

async function deduplicate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'banco_questoes_estatistica'
    });

    console.log('Iniciando desduplicação de questões...');

    try {
        // Encontrar grupos de duplicatas
        const [groups] = await connection.query(`
            SELECT GROUP_CONCAT(id ORDER BY id) as ids, enunciado
            FROM questoes
            WHERE enunciado IS NOT NULL
            GROUP BY enunciado
            HAVING COUNT(*) > 1
        `);

        console.log(`Encontrados ${groups.length} grupos de questões duplicadas.`);

        for (const group of groups) {
            const ids = group.ids.split(',').map(Number);
            const keepId = ids[0]; // Manter o mais antigo
            const removeIds = ids.slice(1); // Remover os outros

            console.log(`\nProcessando grupo (Manter: ${keepId}, Remover: ${removeIds.join(', ')})`);

            for (const removeId of removeIds) {
                // 1. Tratar provas_questoes
                // Verificar onde o removeId é usado
                const [provas] = await connection.query('SELECT prova_id, ordem FROM provas_questoes WHERE questao_id = ?', [removeId]);

                for (const prova of provas) {
                    // Verificar se o keepId já está nessa prova
                    const [exists] = await connection.query(
                        'SELECT 1 FROM provas_questoes WHERE prova_id = ? AND questao_id = ?',
                        [prova.prova_id, keepId]
                    );

                    if (exists.length > 0) {
                        // Já existe, então deletar a referência ao duplicado
                        console.log(`  - Removendo questão ${removeId} da prova ${prova.prova_id} (Questão ${keepId} já existe lá).`);
                        await connection.query(
                            'DELETE FROM provas_questoes WHERE prova_id = ? AND questao_id = ?',
                            [prova.prova_id, removeId]
                        );
                    } else {
                        // Não existe, então atualizar a referência
                        console.log(`  - Atualizando prova ${prova.prova_id}: Questão ${removeId} -> ${keepId}.`);
                        await connection.query(
                            'UPDATE provas_questoes SET questao_id = ? WHERE prova_id = ? AND questao_id = ?',
                            [keepId, prova.prova_id, removeId]
                        );
                    }
                }

                // 2. Tratar respostas (simples update, não deve ter colisão pois id é PK da resposta)
                const [respostas] = await connection.query('SELECT COUNT(*) as qtd FROM respostas WHERE questao_id = ?', [removeId]);
                if (respostas[0].qtd > 0) {
                    console.log(`  - Migrando ${respostas[0].qtd} respostas de ${removeId} para ${keepId}.`);
                    await connection.query('UPDATE respostas SET questao_id = ? WHERE questao_id = ?', [keepId, removeId]);
                }

                // 3. Deletar a questão duplicada
                // (Alternativas e Tags devem ser deletadas via CASCADE, mas vamos garantir)
                console.log(`  - Deletando questão duplicada ${removeId}...`);
                await connection.query('DELETE FROM questoes WHERE id = ?', [removeId]);
            }
        }

        console.log('\nDesduplicação concluída com sucesso!');

    } catch (error) {
        console.error('Erro fatal:', error);
    } finally {
        await connection.end();
    }
}

deduplicate();
