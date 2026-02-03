const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Helper to escape values for SQL
function escape(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val;
    // Basic escaping for strings (handling single quotes and backslashes)
    return "'" + val.replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\n/g, '\\n') + "'";
}

async function exportData() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'banco_questoes_estatistica',
        dateStrings: true // Keep dates as strings to avoid locale issues
    });

    try {
        console.log('--- Iniciando Exportação dos Dados ---');
        let sqlDump = `-- Backup Completo gerado em ${new Date().toISOString()}\n`;
        sqlDump += `SET FOREIGN_KEY_CHECKS=0;\n\n`;

        // Fetch all tables
        const [tableRows] = await connection.query('SHOW TABLES');
        const tables = tableRows.map(row => Object.values(row)[0]);

        console.log('Tabelas encontradas:', tables);

        for (const table of tables) {
            console.log(`Exportando tabela: ${table}...`);
            const [rows] = await connection.query(`SELECT * FROM ${table}`);

            if (rows.length > 0) {
                sqlDump += `-- Dados da tabela ${table} --\n`;
                sqlDump += `TRUNCATE TABLE ${table};\n`;

                for (const row of rows) {
                    const keys = Object.keys(row);
                    const values = Object.values(row).map(escape);
                    sqlDump += `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${values.join(', ')});\n`;
                }
                sqlDump += `\n`;
            }
        }

        sqlDump += `SET FOREIGN_KEY_CHECKS=1;\n`;

        const outputPath = path.join(__dirname, 'database', 'dados_completos.sql');
        fs.writeFileSync(outputPath, sqlDump);
        console.log(`✅ Exportação concluída! Arquivo salvo em: ${outputPath}`);

    } catch (err) {
        console.error('Erro ao exportar:', err);
    } finally {
        await connection.end();
    }
}

exportData();
