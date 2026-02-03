const { promisePool } = require('./db');
const mysql = require('mysql2/promise');

async function diagnoseFinalization() {
    console.log('--- Diagnosis: Prova Finalization Error ---');

    try {
        const connection = await promisePool.getConnection();

        // 1. Encontrar a tentativa mais recente (que pode estar com erro)
        const [tentativas] = await connection.query(`
            SELECT t.id, t.prova_id, t.nome_aluno, t.finalizado_em 
            FROM tentativas t
            ORDER BY t.iniciado_em DESC 
            LIMIT 1
        `);

        if (tentativas.length === 0) {
            console.log('⚠️ Nenhuma tentativa encontrada no banco de dados.');
            return;
        }

        const tentativa = tentativas[0];
        console.log(`\nÚltima tentativa encontrada: ID ${tentativa.id} - ${tentativa.nome_aluno}`);
        console.log(`Status: ${tentativa.finalizado_em ? 'FINALIZADA' : 'EM ABERTO'}`);

        // 2. Simular o passo de finalização (UPDATE)
        console.log('\n2. Testando UPDATE (finalizado_em)...');
        try {
            const tempoTotalSimulado = 120; // 2 minutos
            await connection.query(
                'UPDATE tentativas SET finalizado_em = NOW(), tempo_total = ? WHERE id = ?',
                [tempoTotalSimulado, tentativa.id]
            );
            console.log('✅ UPDATE executado com sucesso.');
        } catch (updateError) {
            console.error('❌ ERRO no UPDATE:', updateError.message);
            // Se falhar aqui, paramos
        }

        // 3. Simular o passo de cálculo (CALL calcular_pontuacao)
        console.log('\n3. Testando procedure calcular_pontuacao...');
        try {
            await connection.query('CALL calcular_pontuacao(?)', [tentativa.id]);
            console.log('✅ CALL calcular_pontuacao executado com sucesso.');
        } catch (callError) {
            console.error('❌ ERRO no CALL calcular_pontuacao:', callError.message);
            console.error('   Detalhes:', callError);
        }

        // 4. Verificar se a pontuação foi gravada
        const [check] = await connection.query('SELECT pontuacao FROM tentativas WHERE id = ?', [tentativa.id]);
        if (check.length > 0) {
            console.log(`\nPontuação atual no banco: ${check[0].pontuacao}`);
        }

        connection.release();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Erro geral no diagnóstico:', error);
        process.exit(1);
    }
}

diagnoseFinalization();
