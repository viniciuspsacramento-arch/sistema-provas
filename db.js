const mysql = require('mysql2');
require('dotenv').config();

// Criar pool de conexões
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'banco_questoes_estatistica',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 30,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Versão com promises
const promisePool = pool.promise();

// Testar conexão
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco de dados:', err.message);
        console.error('   Verifique se o MySQL está rodando e as credenciais em .env estão corretas');
    } else {
        console.log('✅ Conectado ao banco de dados MySQL');
        connection.release();
    }
});

module.exports = { pool, promisePool };
