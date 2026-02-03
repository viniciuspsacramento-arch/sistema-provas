const mysql = require('mysql2/promise');

// Cloud URL
const CLOUD_DB_URL = 'mysql://root:DnfWVyYtTnGNnbwKlKbqegCOZeTvSlin@gondola.proxy.rlwy.net:25921/railway';

async function fixDashboardViewsCloud() {
    console.log('Iniciando RECRIAR VIEWS na NUVEM (Railway)...');

    try {
        const connection = await mysql.createConnection(CLOUD_DB_URL);
        console.log('✅ Conexão obtida com a nuvem.');

        // 1. View: v_questoes_por_topico
        console.log('Recriando View v_questoes_por_topico...');
        await connection.query('DROP VIEW IF EXISTS v_questoes_por_topico');

        const createView1Query = `
            CREATE VIEW v_questoes_por_topico AS
            SELECT 
                t.nome AS topico, 
                COUNT(q.id) AS total_questoes,
                SUM(CASE WHEN q.dificuldade = 'facil' THEN 1 ELSE 0 END) AS faceis,
                SUM(CASE WHEN q.dificuldade = 'medio' THEN 1 ELSE 0 END) AS medias,
                SUM(CASE WHEN q.dificuldade = 'dificil' THEN 1 ELSE 0 END) AS dificeis
            FROM topicos t
            LEFT JOIN questoes q ON t.id = q.topico_id
            GROUP BY t.id, t.nome
        `;
        await connection.query(createView1Query);
        console.log('✅ View v_questoes_por_topico recriada com sucesso.');

        // 2. View: v_desempenho_alunos
        console.log('Recriando View v_desempenho_alunos...');
        await connection.query('DROP VIEW IF EXISTS v_desempenho_alunos');

        const createView2Query = `
            CREATE VIEW v_desempenho_alunos AS
            SELECT 
                nome_aluno, 
                COUNT(id) AS total_provas, 
                AVG(pontuacao) AS media_pontuacao 
            FROM tentativas 
            WHERE finalizado_em IS NOT NULL 
            GROUP BY nome_aluno
        `;
        await connection.query(createView2Query);
        console.log('✅ View v_desempenho_alunos recriada com sucesso.');


        await connection.end();
        console.log('🎉 Views CORRIGIDAS na NUVEM! O dashboard deve carregar agora.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Erro ao recriar views na nuvem:', error);
        process.exit(1);
    }
}

fixDashboardViewsCloud();
