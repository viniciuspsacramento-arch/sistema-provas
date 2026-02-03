const mysql = require('mysql2/promise');
require('dotenv').config();

async function createViews() {
    let connection;

    try {
        // Parse DATABASE_URL if available
        let config;
        if (process.env.DATABASE_URL) {
            const url = new URL(process.env.DATABASE_URL);
            config = {
                host: url.hostname,
                user: url.username,
                password: url.password,
                database: url.pathname.substring(1),
                port: url.port || 3306,
                ssl: { rejectUnauthorized: false }
            };
            console.log('✅ Usando DATABASE_URL para conexão ao Railway');
        } else {
            config = {
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'banco_questoes_estatistica',
                port: process.env.DB_PORT || 3306
            };
            console.log('✅ Usando credenciais locais do .env');
        }

        connection = await mysql.createConnection(config);
        console.log('✅ Conectado ao banco de dados MySQL');

        // Criar view de questões por tópico
        console.log('\n📝 Criando view v_questoes_por_topico...');
        await connection.execute(`
            CREATE OR REPLACE VIEW v_questoes_por_topico AS
            SELECT 
                t.nome as topico,
                COUNT(q.id) as total_questoes,
                SUM(CASE WHEN q.dificuldade = 'facil' THEN 1 ELSE 0 END) as faceis,
                SUM(CASE WHEN q.dificuldade = 'medio' THEN 1 ELSE 0 END) as medias,
                SUM(CASE WHEN q.dificuldade = 'dificil' THEN 1 ELSE 0 END) as dificeis
            FROM topicos t
            LEFT JOIN questoes q ON t.id = q.topico_id
            GROUP BY t.id, t.nome
            HAVING total_questoes > 0
            ORDER BY total_questoes DESC
        `);
        console.log('✅ View v_questoes_por_topico criada!');

        // Criar view de desempenho dos alunos
        console.log('\n📝 Criando view v_desempenho_alunos...');
        await connection.execute(`
            CREATE OR REPLACE VIEW v_desempenho_alunos AS
            SELECT 
                nome_aluno,
                COUNT(*) as total_provas,
                AVG(pontuacao) as media_pontuacao,
                MAX(pontuacao) as melhor_pontuacao,
                MIN(pontuacao) as pior_pontuacao
            FROM tentativas
            WHERE finalizado_em IS NOT NULL
            GROUP BY nome_aluno
            ORDER BY media_pontuacao DESC
        `);
        console.log('✅ View v_desempenho_alunos criada!');

        console.log('\n🎉 Views criadas com sucesso!');

        // Testar as views
        console.log('\n📊 Testando view v_questoes_por_topico:');
        const [topicos] = await connection.execute('SELECT * FROM v_questoes_por_topico');
        console.log(`   Encontrados ${topicos.length} tópicos`);
        topicos.forEach(t => {
            console.log(`   - ${t.topico}: ${t.total_questoes} questões (${t.faceis} fáceis, ${t.medias} médias, ${t.dificeis} difíceis)`);
        });

        console.log('\n👥 Testando view v_desempenho_alunos:');
        const [alunos] = await connection.execute('SELECT * FROM v_desempenho_alunos');
        console.log(`   Encontrados ${alunos.length} alunos`);
        alunos.forEach(a => {
            console.log(`   - ${a.nome_aluno}: ${a.total_provas} provas, média ${Number(a.media_pontuacao).toFixed(1)}`);
        });

    } catch (error) {
        console.error('\n❌ Erro:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n✅ Conexão fechada\n');
        }
    }
}

createViews();
