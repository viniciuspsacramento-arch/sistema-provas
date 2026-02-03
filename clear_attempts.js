const { promisePool } = require('./db');

async function clearData() {
    console.log('🧹 Iniciando limpeza de dados de alunos...');
    const connection = await promisePool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Limpar eventos suspeitos (se existir a tabela, por garantia)
        try {
            const [res] = await connection.query('DELETE FROM eventos_suspeitos');
            console.log(`✅ Eventos suspeitos removidos: ${res.affectedRows}`);
        } catch (e) {
            console.log('ℹ️ Tabela eventos_suspeitos pode não existir ou estar vazia.');
        }

        // 2. Limpar respostas
        const [resResp] = await connection.query('DELETE FROM respostas');
        console.log(`✅ Respostas removidas: ${resResp.affectedRows}`);

        // 3. Limpar tentativas
        const [resTent] = await connection.query('DELETE FROM tentativas');
        console.log(`✅ Tentativas removidas: ${resTent.affectedRows}`);

        await connection.commit();
        console.log('\n✨ Limpeza concluída com sucesso! O dashboard deve estar zerado.');
    } catch (error) {
        await connection.rollback();
        console.error('❌ Erro ao limpar dados:', error);
    } finally {
        connection.release();
        process.exit();
    }
}

clearData();
