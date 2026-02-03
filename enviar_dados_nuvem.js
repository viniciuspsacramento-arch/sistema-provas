const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const urlFile = path.join(__dirname, 'cola_aqui_a_url.txt');
let fileUrl = '';

if (fs.existsSync(urlFile)) {
    const content = fs.readFileSync(urlFile, 'utf8').trim();
    if (content && content !== 'COLE_SUA_URL_AQUI') {
        fileUrl = content;
    }
}

if (!fileUrl) {
    console.error('❌ ERRO: O arquivo cola_aqui_a_url.txt está vazio ou inválido.');
    process.exit(1);
}

startMigration(fileUrl);

async function startMigration(dbUrl) {
    console.log('--- Iniciando Migração FINAL v4 (Sanitização REAL) ---');

    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const dataPath = path.join(__dirname, 'database', 'dados_completos.sql');

    if (!fs.existsSync(schemaPath) || !fs.existsSync(dataPath)) {
        console.error('❌ ERRO: Arquivos SQL não encontrados.');
        process.exit(1);
    }

    // 1. SANITIZE SCHEMA
    console.log('Lendo e limpando SCHEMA...');
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');
    schemaSql = schemaSql.replace(/CREATE DATABASE[\s\S]*?USE .*?;/im, '');
    schemaSql = schemaSql.replace(/^USE .*?;/gim, '');
    const schemaQueries = parseSql(schemaSql);

    // 2. SANITIZE DATA
    console.log('Lendo e limpando DADOS...');
    let dataSql = fs.readFileSync(dataPath, 'utf8');

    // Clean header artifacts
    dataSql = dataSql.replace(/CREATE DATABASE[\s\S]*?;/im, '');
    dataSql = dataSql.replace(/^USE .*?;/gim, '');

    // Remove LOCKS
    dataSql = dataSql.replace(/^LOCK TABLES .*?;/gim, '');
    dataSql = dataSql.replace(/^UNLOCK TABLES;/gim, '');

    // CRITICAL FIX: Remove INSERTs and TRUNCATEs for VIEWs
    // The backup treats views as tables, we must strip these commands.
    dataSql = dataSql.replace(/^INSERT INTO v_.*?;/gim, '-- INSERT VIEW STRIPPED');
    dataSql = dataSql.replace(/^TRUNCATE TABLE v_.*?;/gim, '-- TRUNCATE VIEW STRIPPED');

    console.log(`Schema limpo: ${schemaQueries.length} queries.`);
    console.log(`Data limpo: ${(dataSql.length / 1024).toFixed(2)} KB.`);

    console.log('Conectando ao Railway...');
    let connection;
    try {
        const dbUrlObj = new URL(dbUrl);
        const config = {
            host: dbUrlObj.hostname,
            user: dbUrlObj.username,
            password: dbUrlObj.password,
            database: dbUrlObj.pathname.substring(1),
            port: Number(dbUrlObj.port) || 3306,
            ssl: { rejectUnauthorized: false },
            connectTimeout: 20000,
            multipleStatements: true
        };

        connection = await mysql.createConnection(config);
        console.log('✅ Conectado!');

        console.log('0. LIMPANDO TUDO (No banco correto)...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        const tables = [
            'respostas', 'tentativas', 'provas_questoes', 'provas',
            'questoes_tags', 'tags', 'alternativas', 'questoes', 'topicos'
        ];

        for (const table of tables) {
            await connection.query(`DROP TABLE IF EXISTS ${table}`);
        }

        await connection.query("DROP VIEW IF EXISTS v_questoes_por_topico");
        await connection.query("DROP VIEW IF EXISTS v_desempenho_alunos");
        await connection.query("DROP PROCEDURE IF EXISTS calcular_pontuacao");
        await connection.query("DROP TRIGGER IF EXISTS tr_verificar_resposta_correta");

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✅ Limpeza concluída.');

        console.log('1. Criando Tabelas...');
        for (const query of schemaQueries) {
            try {
                await connection.query(query);
            } catch (err) {
                if (!err.message.includes('already exists')) {
                    console.warn(`   ⚠️ Aviso Schema: ${err.message}`);
                }
            }
        }
        console.log('✅ Tabelas criadas.');

        console.log('2. Inserindo Dados...');
        try {
            await connection.query(dataSql);
            console.log('\n✅✅✅ SUCESSO TOTAL! BANCO MIGRADO! 🚀');
        } catch (errData) {
            console.error('❌ Erro enviando DADOS:', errData.message);
        }

    } catch (err) {
        console.error('❌ Erro CRÍTICO:', err.message);
    } finally {
        if (connection) await connection.end();
    }
}

function parseSql(sql) {
    const queries = [];
    let currentDelimiter = ';';
    let buffer = '';
    const lines = sql.split('\n');

    for (let line of lines) {
        const trimmed = line.trim();
        if (trimmed.toUpperCase().startsWith('DELIMITER ')) {
            currentDelimiter = trimmed.split(' ')[1];
            continue;
        }
        if (trimmed.startsWith('--') || trimmed.startsWith('/*')) continue;
        if (trimmed === '') continue;

        buffer += line + '\n';

        const bufferTrimmed = buffer.trim();
        if (bufferTrimmed.endsWith(currentDelimiter)) {
            let query = bufferTrimmed.substring(0, bufferTrimmed.length - currentDelimiter.length);
            query = query.trim();
            if (query.length > 0) queries.push(query);
            buffer = '';
        }
    }
    if (buffer.trim().length > 0) queries.push(buffer.trim());
    return queries;
}
