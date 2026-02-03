const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Cloud URL (Hardcoded for this task to ensure it works)
const CLOUD_DB_URL = 'mysql://root:DnfWVyYtTnGNnbwKlKbqegCOZeTvSlin@gondola.proxy.rlwy.net:25921/railway';

async function runSql(filePath) {
    console.log(`--- Executing ${filePath} on CLOUD DB ---`);

    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        return;
    }

    const sql = fs.readFileSync(filePath, 'utf8');
    const queries = parseSql(sql);

    console.log(`Found ${queries.length} queries.`);

    let connection;
    try {
        connection = await mysql.createConnection(CLOUD_DB_URL);
        console.log('Connected to Railway!');

        for (const query of queries) {
            try {
                await connection.query(query);
            } catch (err) {
                console.error('Error executing query:', err.message);
                // Continue despite errors (e.g. duplicate key)
            }
        }
        console.log('Done.');

    } catch (err) {
        console.error('Connection error:', err);
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

const targetFile = process.argv[2];
if (targetFile) {
    runSql(targetFile);
} else {
    console.log('Usage: node run_sql_cloud.js <path_to_sql_file>');
}
