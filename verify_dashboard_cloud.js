const mysql = require('mysql2/promise');

// Cloud URL
const CLOUD_DB_URL = 'mysql://root:DnfWVyYtTnGNnbwKlKbqegCOZeTvSlin@gondola.proxy.rlwy.net:25921/railway';

async function verifyDashboardCloud() {
    console.log('--- Verificando Saúde do Dashboard na Nuvem ---');

    let connection;
    try {
        connection = await mysql.createConnection(CLOUD_DB_URL);
        console.log('✅ Conexão estabelecida com sucesso.');

        // Teste 1: Consultar Estatísticas Gerais (Query direta)
        console.log('\n1. Testando Stats Gerais (Totalizadores)...');
        const [stats] = await connection.query(`
            SELECT 
                (SELECT COUNT(*) FROM questoes) as total_questoes,
                (SELECT COUNT(*) FROM provas) as total_provas,
                (SELECT COUNT(*) FROM tentativas WHERE finalizado_em IS NOT NULL) as total_tentativas
        `);
        console.log(`   Resultado: ${JSON.stringify(stats[0])}`);
        console.log('   ✅ Query de stats funcionou.');

        // Teste 2: Consultar View v_questoes_por_topico
        console.log('\n2. Testando View v_questoes_por_topico (Gráfico Barras)...');
        try {
            const [rows] = await connection.query('SELECT * FROM v_questoes_por_topico LIMIT 3');
            console.log(`   Linhas encontradas: ${rows.length}`);
            if (rows.length > 0) console.log(`   Exemplo: ${JSON.stringify(rows[0])}`);
            console.log('   ✅ View v_questoes_por_topico existe e está acessível.');
        } catch (err) {
            console.error('   ❌ FALHA na View v_questoes_por_topico:', err.message);
            throw err;
        }

        // Teste 3: Consultar View v_desempenho_alunos
        console.log('\n3. Testando View v_desempenho_alunos (Top Alunos)...');
        try {
            const [rows] = await connection.query('SELECT * FROM v_desempenho_alunos LIMIT 3');
            console.log(`   Linhas encontradas: ${rows.length}`);
            if (rows.length > 0) console.log(`   Exemplo: ${JSON.stringify(rows[0])}`);
            console.log('   ✅ View v_desempenho_alunos existe e está acessível.');
        } catch (err) {
            console.error('   ❌ FALHA na View v_desempenho_alunos:', err.message);
            throw err;
        }

        console.log('\n🎉 CONCLUSÃO: O Dashboard deve carregar PERFEITAMENTE agora.');
        console.log('   (Todas as tabelas e views necessárias responderam corretamente)');

    } catch (err) {
        console.error('\n❌ ERRO GERAL:', err.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

verifyDashboardCloud();
