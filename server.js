const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisePool, dbConfig } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Auto-correção do Banco de Dados na inicialização
async function verificarECorrigirBanco() {
    console.log('🔧 Verificando integridade do banco de dados...');
    try {
        const connection = await promisePool.getConnection();

        // 1. Verificar se coluna 'matricula' existe na tabela 'tentativas'
        try {
            const [cols] = await connection.query("SHOW COLUMNS FROM tentativas LIKE 'matricula'");
            if (cols.length === 0) {
                console.log('⚠️ Coluna matricula não encontrada. Adicionando...');
                await connection.query("ALTER TABLE tentativas ADD COLUMN matricula VARCHAR(20) NOT NULL AFTER nome_aluno");
                console.log('✅ Coluna matricula adicionada!');

                // Adicionar índice UNIQUE para garantir uma tentativa por matrícula (opcional, mas bom pra garantir integridade)
                // Vamos criar um índice UNIQUE em (matricula) para que o aluno só possa fazer UMA prova no total
                // Se fosse uma prova por TIPO, seria (matricula, prova_id). Mas o requisito é "uma única vez por matrícula".
                await connection.query("CREATE UNIQUE INDEX idx_matricula_unica ON tentativas(matricula)");
                console.log('✅ Índice único por matrícula criado!');
            }
        } catch (e) {
            console.error('Erro na migração de matricula:', e.message);
        }

        // 2. Verificar se coluna 'correta' existe na tabela 'respostas'
        try {
            const [colsRes] = await connection.query("SHOW COLUMNS FROM respostas LIKE 'correta'");
            if (colsRes.length === 0) {
                console.log('⚠️ Coluna correta não encontrada em respostas. Adicionando...');
                await connection.query("ALTER TABLE respostas ADD COLUMN correta BOOLEAN DEFAULT NULL AFTER resposta_texto");

                // Tentar popular com base nas alternativas existentes
                console.log('🔄 Populando coluna correta com dados existentes...');
                await connection.query(`
                    UPDATE respostas r 
                    JOIN alternativas a ON r.alternativa_id = a.id 
                    SET r.correta = a.correta
                `);
                console.log('✅ Coluna correta adicionada e populada!');
            }
        } catch (e) {
            console.error('Erro na migração de correta:', e.message);
        }

        // View: v_questoes_por_topico
        await connection.query(`
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
        console.log('✅ View v_questoes_por_topico verificada/criada');

        // View: v_desempenho_alunos
        await connection.query(`
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
        console.log('✅ View v_desempenho_alunos verificada/criada');

        // ============================================
        // PROCEDURES
        // ============================================

        // Procedure: calcular_pontuacao
        try {
            await connection.query('DROP PROCEDURE IF EXISTS calcular_pontuacao');
            await connection.query(`
                CREATE PROCEDURE calcular_pontuacao(IN p_tentativa_id INT)
                BEGIN
                    DECLARE v_total_questoes INT;
                    DECLARE v_respostas_corretas DECIMAL(10,2);
                    DECLARE v_pontuacao DECIMAL(5,2);
                    
                    -- Contar total de questões da prova
                    SELECT COUNT(*) INTO v_total_questoes
                    FROM provas_questoes pq
                    JOIN tentativas t ON t.prova_id = pq.prova_id
                    WHERE t.id = p_tentativa_id;
                    
                    -- Calcular acertos
                    SELECT COUNT(*) INTO v_respostas_corretas
                    FROM respostas r
                    WHERE r.tentativa_id = p_tentativa_id AND r.correta = TRUE;
                    
                    -- Calcular pontuação
                    IF v_total_questoes > 0 THEN
                        SET v_pontuacao = (v_respostas_corretas / v_total_questoes) * 100;
                    ELSE
                        SET v_pontuacao = 0;
                    END IF;
                    
                    -- Atualizar tentativa
                    UPDATE tentativas 
                    SET pontuacao = v_pontuacao
                    WHERE id = p_tentativa_id;
                END
            `);
            console.log('✅ Procedure calcular_pontuacao recriada');
        } catch (e) {
            console.error('⚠️ Erro ao recriar procedure:', e.message);
        }

        // ============================================
        // TRIGGERS
        // ============================================

        // Trigger: tr_verificar_resposta_correta
        try {
            await connection.query('DROP TRIGGER IF EXISTS tr_verificar_resposta_correta');
            await connection.query(`
                CREATE TRIGGER tr_verificar_resposta_correta
                BEFORE INSERT ON respostas
                FOR EACH ROW
                BEGIN
                    IF NEW.alternativa_id IS NOT NULL THEN
                        SET NEW.correta = (SELECT correta FROM alternativas WHERE id = NEW.alternativa_id);
                    END IF;
                END
            `);
            console.log('✅ Trigger tr_verificar_resposta_correta recriada');
        } catch (e) {
            console.error('⚠️ Erro ao recriar trigger:', e.message);
        }

        connection.release();
        console.log('🚀 Banco de dados pronto e corrigido!');
    } catch (error) {
        console.error('❌ Erro na auto-correção do banco:', error);
    }
}

// Inicializar verificação
verificarECorrigirBanco();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rota de Diagnóstico (Healthcheck)
app.get('/api/healthcheck', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT 1 as val');
        res.json({
            status: 'online',
            database: 'connected',
            timestamp: new Date(),
            version: '1.0.1'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            database: 'disconnected',
            error: error.message
        });
    }
});

// ============================================
// AUTENTICAÇÃO
// ============================================



// Função auxiliar para determinar a senha de admin
function determineAdminPassword() {
    let adminPassword = process.env.ADMIN_PASSWORD;

    // Se não houver senha definida, tenta usar a do banco (comum no Railway)
    if (!adminPassword && dbConfig && dbConfig.password) {
        adminPassword = dbConfig.password;
    }

    // Fallback final
    if (!adminPassword) {
        adminPassword = 'admin123';
    }

    return adminPassword;
}

app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    const adminPassword = determineAdminPassword();

    // Backdoor para localhost: aceita senha 'admin' simples
    const isLocal = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
    if (isLocal && password === 'admin') {
        console.log('🔓 Login local via backdoor (senha: admin)');
        return res.json({ success: true, token: 'admin-session-active' });
    }

    if (password === adminPassword) {
        res.json({ success: true, token: 'admin-session-active' });
    } else {
        res.status(401).json({ success: false, error: 'Senha incorreta' });
    }
});



// Criar diretório de uploads se não existir
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'questao-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
        }
    }
});

// ============================================
// ROTAS - TÓPICOS
// ============================================

// Listar todos os tópicos
app.get('/api/topicos', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM topicos ORDER BY nome');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar tópicos:', error);
        res.status(500).json({ error: 'Erro ao buscar tópicos' });
    }
});

// Criar novo tópico
app.post('/api/topicos', async (req, res) => {
    try {
        const { nome, descricao } = req.body;
        const [result] = await promisePool.query(
            'INSERT INTO topicos (nome, descricao) VALUES (?, ?)',
            [nome, descricao]
        );
        res.status(201).json({ id: result.insertId, nome, descricao });
    } catch (error) {
        console.error('Erro ao criar tópico:', error);
        res.status(500).json({ error: 'Erro ao criar tópico' });
    }
});

// ============================================
// ROTAS - TAGS
// ============================================

// Listar todas as tags
app.get('/api/tags', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM tags ORDER BY nome');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar tags:', error);
        res.status(500).json({ error: 'Erro ao buscar tags' });
    }
});

// Criar nova tag
app.post('/api/tags', async (req, res) => {
    try {
        const { nome } = req.body;
        const [result] = await promisePool.query(
            'INSERT INTO tags (nome) VALUES (?)',
            [nome]
        );
        res.status(201).json({ id: result.insertId, nome });
    } catch (error) {
        console.error('Erro ao criar tag:', error);
        res.status(500).json({ error: 'Erro ao criar tag' });
    }
});

// ============================================
// ROTAS - UPLOAD
// ============================================

// Upload de imagem
app.post('/api/upload', upload.single('imagem'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
        }
        const imagemUrl = '/uploads/' + req.file.filename;
        res.json({ url: imagemUrl, filename: req.file.filename });
    } catch (error) {
        console.error('Erro no upload:', error);
        res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
    }
});

// ============================================
// ROTAS - QUESTÕES
// ============================================

// Listar questões com filtros
app.get('/api/questoes', async (req, res) => {
    try {
        const { topico_id, dificuldade, tipo, tag } = req.query;

        let query = `
            SELECT DISTINCT q.*, t.nome as topico_nome
            FROM questoes q
            JOIN topicos t ON q.topico_id = t.id
            LEFT JOIN questoes_tags qt ON q.id = qt.questao_id
            LEFT JOIN tags tg ON qt.tag_id = tg.id
            WHERE 1=1
        `;
        const params = [];

        if (topico_id) {
            query += ' AND q.topico_id = ?';
            params.push(topico_id);
        }
        if (dificuldade) {
            query += ' AND q.dificuldade = ?';
            params.push(dificuldade);
        }
        if (tipo) {
            query += ' AND q.tipo = ?';
            params.push(tipo);
        }
        if (tag) {
            query += ' AND tg.nome = ?';
            params.push(tag);
        }

        query += ' ORDER BY q.criado_em DESC';

        const [rows] = await promisePool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar questões:', error);
        res.status(500).json({ error: 'Erro ao buscar questões' });
    }
});

// Obter questão específica com alternativas e tags
app.get('/api/questoes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar questão
        const [questoes] = await promisePool.query(
            'SELECT q.*, t.nome as topico_nome FROM questoes q JOIN topicos t ON q.topico_id = t.id WHERE q.id = ?',
            [id]
        );

        if (questoes.length === 0) {
            return res.status(404).json({ error: 'Questão não encontrada' });
        }

        const questao = questoes[0];

        // Buscar alternativas
        const [alternativas] = await promisePool.query(
            'SELECT * FROM alternativas WHERE questao_id = ? ORDER BY ordem',
            [id]
        );

        // Buscar tags
        const [tags] = await promisePool.query(
            'SELECT t.* FROM tags t JOIN questoes_tags qt ON t.id = qt.tag_id WHERE qt.questao_id = ?',
            [id]
        );

        questao.alternativas = alternativas;
        questao.tags = tags;

        res.json(questao);
    } catch (error) {
        console.error('Erro ao buscar questão:', error);
        res.status(500).json({ error: 'Erro ao buscar questão' });
    }
});

// Criar nova questão
app.post('/api/questoes', async (req, res) => {
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();

        const { enunciado, enunciado_imagem, topico_id, dificuldade, tipo, usa_imagem, alternativas, tags } = req.body;

        // Inserir questão
        const [result] = await connection.query(
            'INSERT INTO questoes (enunciado, enunciado_imagem, topico_id, dificuldade, tipo, usa_imagem) VALUES (?, ?, ?, ?, ?, ?)',
            [enunciado, enunciado_imagem, topico_id, dificuldade, tipo, usa_imagem || false]
        );

        const questao_id = result.insertId;

        // Inserir alternativas
        if (alternativas && alternativas.length > 0) {
            for (let i = 0; i < alternativas.length; i++) {
                const alt = alternativas[i];
                await connection.query(
                    'INSERT INTO alternativas (questao_id, texto, imagem, correta, ordem) VALUES (?, ?, ?, ?, ?)',
                    [questao_id, alt.texto, alt.imagem, alt.correta, i + 1]
                );
            }
        }

        // Inserir tags
        if (tags && tags.length > 0) {
            for (const tag_id of tags) {
                await connection.query(
                    'INSERT INTO questoes_tags (questao_id, tag_id) VALUES (?, ?)',
                    [questao_id, tag_id]
                );
            }
        }

        await connection.commit();
        res.status(201).json({ id: questao_id, message: 'Questão criada com sucesso' });
    } catch (error) {
        await connection.rollback();
        console.error('Erro ao criar questão:', error);
        res.status(500).json({ error: 'Erro ao criar questão' });
    } finally {
        connection.release();
    }
});

// Atualizar questão
app.put('/api/questoes/:id', async (req, res) => {
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();

        const { id } = req.params;
        const { enunciado, enunciado_imagem, topico_id, dificuldade, tipo, usa_imagem, alternativas, tags } = req.body;

        // Atualizar questão
        await connection.query(
            'UPDATE questoes SET enunciado = ?, enunciado_imagem = ?, topico_id = ?, dificuldade = ?, tipo = ?, usa_imagem = ? WHERE id = ?',
            [enunciado, enunciado_imagem, topico_id, dificuldade, tipo, usa_imagem, id]
        );

        // Deletar alternativas antigas
        await connection.query('DELETE FROM alternativas WHERE questao_id = ?', [id]);

        // Inserir novas alternativas
        if (alternativas && alternativas.length > 0) {
            for (let i = 0; i < alternativas.length; i++) {
                const alt = alternativas[i];
                await connection.query(
                    'INSERT INTO alternativas (questao_id, texto, imagem, correta, ordem) VALUES (?, ?, ?, ?, ?)',
                    [id, alt.texto, alt.imagem, alt.correta, i + 1]
                );
            }
        }

        // Atualizar tags
        await connection.query('DELETE FROM questoes_tags WHERE questao_id = ?', [id]);
        if (tags && tags.length > 0) {
            for (const tag_id of tags) {
                await connection.query(
                    'INSERT INTO questoes_tags (questao_id, tag_id) VALUES (?, ?)',
                    [id, tag_id]
                );
            }
        }

        await connection.commit();
        res.json({ message: 'Questão atualizada com sucesso' });
    } catch (error) {
        await connection.rollback();
        console.error('Erro ao atualizar questão:', error);
        res.status(500).json({ error: 'Erro ao atualizar questão' });
    } finally {
        connection.release();
    }
});

// Deletar questão
app.delete('/api/questoes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await promisePool.query('DELETE FROM questoes WHERE id = ?', [id]);
        res.json({ message: 'Questão deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar questão:', error);
        res.status(500).json({ error: 'Erro ao deletar questão' });
    }
});

// ============================================
// ROTAS - PROVAS
// ============================================

// Listar provas
app.get('/api/provas', async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT p.*, COUNT(pq.questao_id) as total_questoes
            FROM provas p
            LEFT JOIN provas_questoes pq ON p.id = pq.prova_id
            GROUP BY p.id
            ORDER BY p.criado_em DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar provas:', error);
        res.status(500).json({ error: 'Erro ao buscar provas' });
    }
});

// Obter prova específica com questões
app.get('/api/provas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { incluir_gabarito } = req.query;

        // Buscar prova
        const [provas] = await promisePool.query('SELECT * FROM provas WHERE id = ?', [id]);

        if (provas.length === 0) {
            return res.status(404).json({ error: 'Prova não encontrada' });
        }

        const prova = provas[0];

        // Buscar questões da prova
        const [questoes] = await promisePool.query(`
            SELECT q.*, pq.ordem, t.nome as topico_nome
            FROM questoes q
            JOIN provas_questoes pq ON q.id = pq.questao_id
            JOIN topicos t ON q.topico_id = t.id
            WHERE pq.prova_id = ?
            ORDER BY pq.ordem
        `, [id]);

        // Buscar alternativas para cada questão
        for (let questao of questoes) {
            let query = 'SELECT id, questao_id, texto, imagem, ordem';

            // Incluir gabarito apenas se solicitado
            if (incluir_gabarito === 'true') {
                query += ', correta';
            }

            query += ' FROM alternativas WHERE questao_id = ? ORDER BY ordem';

            const [alternativas] = await promisePool.query(query, [questao.id]);
            questao.alternativas = alternativas;
        }

        prova.questoes = questoes;
        res.json(prova);
    } catch (error) {
        console.error('Erro ao buscar prova:', error);
        res.status(500).json({ error: 'Erro ao buscar prova' });
    }
});

// Criar nova prova
app.post('/api/provas', async (req, res) => {
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();

        const { titulo, titulo_publico, descricao, tempo_limite, questoes } = req.body;

        // Inserir prova
        const [result] = await connection.query(
            'INSERT INTO provas (titulo, titulo_publico, descricao, tempo_limite) VALUES (?, ?, ?, ?)',
            [titulo, titulo_publico, descricao, tempo_limite]
        );

        const prova_id = result.insertId;

        // Inserir questões da prova
        if (questoes && questoes.length > 0) {
            for (let i = 0; i < questoes.length; i++) {
                await connection.query(
                    'INSERT INTO provas_questoes (prova_id, questao_id, ordem) VALUES (?, ?, ?)',
                    [prova_id, questoes[i], i + 1]
                );
            }
        }

        await connection.commit();
        res.status(201).json({ id: prova_id, message: 'Prova criada com sucesso' });
    } catch (error) {
        await connection.rollback();
        console.error('Erro ao criar prova:', error);
        res.status(500).json({ error: 'Erro ao criar prova' });
    } finally {
        connection.release();
    }
});

// Atualizar prova existente
app.put('/api/provas/:id', async (req, res) => {
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();

        const { id } = req.params;
        const { titulo, titulo_publico, descricao, tempo_limite, questoes } = req.body;

        // Atualizar dados da prova
        await connection.query(
            'UPDATE provas SET titulo = ?, titulo_publico = ?, descricao = ?, tempo_limite = ? WHERE id = ?',
            [titulo, titulo_publico, descricao, tempo_limite, id]
        );

        // Atualizar questões: Estratégia simples (Deletar tudo e reinserir)
        // Primeiro, deletar associações existentes
        await connection.query('DELETE FROM provas_questoes WHERE prova_id = ?', [id]);

        // Inserir novas questões
        if (questoes && questoes.length > 0) {
            for (let i = 0; i < questoes.length; i++) {
                await connection.query(
                    'INSERT INTO provas_questoes (prova_id, questao_id, ordem) VALUES (?, ?, ?)',
                    [id, questoes[i], i + 1]
                );
            }
        }

        await connection.commit();
        res.json({ message: 'Prova atualizada com sucesso' });
    } catch (error) {
        await connection.rollback();
        console.error('Erro ao atualizar prova:', error);
        res.status(500).json({ error: 'Erro ao atualizar prova' });
    } finally {
        connection.release();
    }
});

// Gerar prova automaticamente
app.post('/api/provas/gerar', async (req, res) => {
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();

        const { titulo, titulo_publico, descricao, tempo_limite, criterios } = req.body;
        // criterios: { topico_id, dificuldade, quantidade }

        let query = 'SELECT id FROM questoes WHERE 1=1';
        const params = [];

        if (criterios.topico_id) {
            query += ' AND topico_id = ?';
            params.push(criterios.topico_id);
        }
        if (criterios.dificuldade) {
            query += ' AND dificuldade = ?';
            params.push(criterios.dificuldade);
        }

        query += ' ORDER BY RAND() LIMIT ?';
        params.push(criterios.quantidade || 10);

        const [questoes] = await connection.query(query, params);

        if (questoes.length === 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Nenhuma questão encontrada com os critérios especificados' });
        }

        // Criar prova
        const [result] = await connection.query(
            'INSERT INTO provas (titulo, titulo_publico, descricao, tempo_limite) VALUES (?, ?, ?, ?)',
            [titulo, titulo_publico, descricao, tempo_limite]
        );

        const prova_id = result.insertId;

        // Adicionar questões
        for (let i = 0; i < questoes.length; i++) {
            await connection.query(
                'INSERT INTO provas_questoes (prova_id, questao_id, ordem) VALUES (?, ?, ?)',
                [prova_id, questoes[i].id, i + 1]
            );
        }

        await connection.commit();
        res.status(201).json({
            id: prova_id,
            message: 'Prova gerada com sucesso',
            total_questoes: questoes.length
        });
    } catch (error) {
        await connection.rollback();
        console.error('Erro ao gerar prova:', error);
        res.status(500).json({ error: 'Erro ao gerar prova' });
    } finally {
        connection.release();
    }
});

// Deletar prova
app.delete('/api/provas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await promisePool.query('DELETE FROM provas WHERE id = ?', [id]);
        res.json({ message: 'Prova deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar prova:', error);
        res.status(500).json({ error: 'Erro ao deletar prova' });
    }
});

// ============================================
// ROTAS - TENTATIVAS
// ============================================

// Iniciar tentativa de prova
// Iniciar tentativa de prova
app.post('/api/tentativas', async (req, res) => {
    try {
        const { prova_id, nome_aluno, matricula } = req.body;

        if (!matricula) {
            return res.status(400).json({ error: 'Matrícula é obrigatória' });
        }

        // Verificar se a matrícula já realizou alguma prova
        const [existing] = await promisePool.query(
            'SELECT id FROM tentativas WHERE matricula = ?',
            [matricula]
        );

        if (existing.length > 0) {
            return res.status(403).json({
                error: 'Esta matrícula já realizou uma prova. Não é permitido fazer novamente.'
            });
        }

        const [result] = await promisePool.query(
            'INSERT INTO tentativas (prova_id, nome_aluno, matricula) VALUES (?, ?, ?)',
            [prova_id, nome_aluno, matricula]
        );

        res.status(201).json({
            id: result.insertId,
            prova_id,
            nome_aluno,
            matricula,
            iniciado_em: new Date()
        });
    } catch (error) {
        console.error('Erro ao iniciar tentativa:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(403).json({ error: 'Esta matrícula já realizou uma prova.' });
        }
        res.status(500).json({ error: 'Erro ao iniciar tentativa' });
    }
});

// Submeter resposta
app.post('/api/tentativas/:id/responder', async (req, res) => {
    try {
        const { id } = req.params;
        const { questao_id, alternativa_id, resposta_texto } = req.body;

        // Verificar se já existe resposta para esta questão nesta tentativa
        const [existing] = await promisePool.query(
            'SELECT id FROM respostas WHERE tentativa_id = ? AND questao_id = ?',
            [id, questao_id]
        );

        // Verificar se a alternativa é correta (substitui Trigger)
        let correta = false;
        if (alternativa_id) {
            const [alt] = await promisePool.query('SELECT correta FROM alternativas WHERE id = ?', [alternativa_id]);
            if (alt.length > 0) correta = alt[0].correta === 1;
        }

        if (existing.length > 0) {
            // Atualizar resposta existente
            await promisePool.query(
                'UPDATE respostas SET alternativa_id = ?, resposta_texto = ?, correta = ?, respondido_em = NOW() WHERE id = ?',
                [alternativa_id, resposta_texto, correta, existing[0].id]
            );
        } else {
            // Inserir nova resposta
            await promisePool.query(
                'INSERT INTO respostas (tentativa_id, questao_id, alternativa_id, resposta_texto, correta) VALUES (?, ?, ?, ?, ?)',
                [id, questao_id, alternativa_id, resposta_texto, correta]
            );
        }

        res.json({ message: 'Resposta registrada com sucesso' });
    } catch (error) {
        console.error('Erro ao registrar resposta:', error);
        res.status(500).json({ error: 'Erro ao registrar resposta' });
    }
});

// Registrar troca de aba
app.post('/api/tentativas/:id/troca-aba', async (req, res) => {
    try {
        const { id } = req.params;

        await promisePool.query(
            'UPDATE tentativas SET trocas_aba = trocas_aba + 1 WHERE id = ?',
            [id]
        );

        res.json({ message: 'Troca de aba registrada' });
    } catch (error) {
        console.error('Erro ao registrar troca de aba:', error);
        res.status(500).json({ error: 'Erro ao registrar troca de aba' });
    }
});

// Finalizar prova
app.post('/api/tentativas/:id/finalizar', async (req, res) => {
    try {
        const { id } = req.params;
        const { tempo_total } = req.body;

        // Atualizar tempo e data de finalização
        await promisePool.query(
            'UPDATE tentativas SET finalizado_em = NOW(), tempo_total = ? WHERE id = ?',
            [tempo_total, id]
        );

        // 0. Correção preventiva: Garantir que 'correta' está preenchido (caso trigger tenha falhado)
        await promisePool.query(`
            UPDATE respostas r 
            JOIN alternativas a ON r.alternativa_id = a.id 
            SET r.correta = a.correta 
            WHERE r.tentativa_id = ?
        `, [id]);

        // Calcular pontuação via JS (substitui Procedure)
        // 1. Contar questões da prova
        const [totalQ] = await promisePool.query(`
            SELECT COUNT(*) as total 
            FROM provas_questoes pq 
            JOIN tentativas t ON t.prova_id = pq.prova_id 
            WHERE t.id = ?
        `, [id]);

        // 2. Contar acertos
        const [acertos] = await promisePool.query(`
            SELECT COUNT(*) as total 
            FROM respostas 
            WHERE tentativa_id = ? AND correta = 1
        `, [id]);

        const totalQuestoes = totalQ[0].total;
        const totalAcertos = acertos[0].total;
        let pontuacao = 0;

        if (totalQuestoes > 0) {
            pontuacao = (totalAcertos / totalQuestoes) * 100;
        }

        console.log(`📝 Finalizando prova ${id}: Acertos=${totalAcertos}/${totalQuestoes} (Score=${pontuacao})`);

        // 3. Atualizar pontuação na tentativa
        const [updateResult] = await promisePool.query('UPDATE tentativas SET pontuacao = ? WHERE id = ?', [pontuacao, id]);

        if (updateResult.affectedRows === 0) {
            throw new Error(`Tentativa ${id} não encontrada para atualização`);
        }

        res.json({ message: 'Prova finalizada com sucesso', pontuacao, acertos: totalAcertos });
    } catch (error) {
        console.error('❌ Erro CRÍTICO ao finalizar prova:', error);
        res.status(500).json({
            error: 'Erro ao finalizar prova',
            details: error.message || 'Erro desconhecido',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Obter resultado da tentativa
app.get('/api/tentativas/:id/resultado', async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar tentativa
        const [tentativas] = await promisePool.query(`
            SELECT t.*, p.titulo, p.titulo_publico as prova_titulo
            FROM tentativas t
            JOIN provas p ON t.prova_id = p.id
            WHERE t.id = ?
        `, [id]);

        if (tentativas.length === 0) {
            return res.status(404).json({ error: 'Tentativa não encontrada' });
        }

        const tentativa = tentativas[0];

        // Buscar respostas com gabarito
        const [respostas] = await promisePool.query(`
            SELECT 
                r.*,
                q.enunciado,
                q.enunciado_imagem,
                a.texto as resposta_texto_alt,
                a.correta as resposta_correta,
                ac.texto as gabarito_texto,
                ac.id as gabarito_id
            FROM respostas r
            JOIN questoes q ON r.questao_id = q.id
            LEFT JOIN alternativas a ON r.alternativa_id = a.id
            LEFT JOIN alternativas ac ON q.id = ac.questao_id AND ac.correta = TRUE
            WHERE r.tentativa_id = ?
            ORDER BY r.questao_id
        `, [id]);

        tentativa.respostas = respostas;

        // Calcular estatísticas
        const total_questoes = respostas.length;
        const corretas = respostas.filter(r => r.correta).length;
        const incorretas = total_questoes - corretas;

        tentativa.estatisticas = {
            total_questoes,
            corretas,
            incorretas,
            percentual_acerto: total_questoes > 0 ? (corretas / total_questoes * 100).toFixed(2) : 0
        };

        res.json(tentativa);
    } catch (error) {
        console.error('Erro ao buscar resultado:', error);
        res.status(500).json({ error: 'Erro ao buscar resultado' });
    }
});

// Listar tentativas
app.get('/api/tentativas', async (req, res) => {
    try {
        const { prova_id, nome_aluno } = req.query;

        let query = `
            SELECT t.*, COALESCE(p.titulo_publico, p.titulo) as prova_titulo
            FROM tentativas t
            JOIN provas p ON t.prova_id = p.id
            WHERE 1=1
        `;
        const params = [];

        if (prova_id) {
            query += ' AND t.prova_id = ?';
            params.push(prova_id);
        }
        if (nome_aluno) {
            query += ' AND t.nome_aluno LIKE ?';
            params.push(`%${nome_aluno}%`);
        }

        query += ' ORDER BY t.iniciado_em DESC';

        const [rows] = await promisePool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar tentativas:', error);
        res.status(500).json({ error: 'Erro ao buscar tentativas' });
    }
});

// ============================================
// ROTAS - ANTI-FRAUDE
// ============================================

// Registrar evento suspeito
app.post('/api/eventos-suspeitos', async (req, res) => {
    try {
        const { tentativa_id, tipo_evento, detalhes } = req.body;

        await promisePool.query(
            'INSERT INTO eventos_suspeitos (tentativa_id, tipo_evento, detalhes) VALUES (?, ?, ?)',
            [tentativa_id, tipo_evento, JSON.stringify(detalhes)]
        );

        // Atualizar contadores específicos
        if (tipo_evento === 'perda_foco') {
            await promisePool.query(
                'UPDATE tentativas SET total_perdas_foco = total_perdas_foco + 1 WHERE id = ?',
                [tentativa_id]
            );
        } else if (tipo_evento === 'tentativa_print') {
            await promisePool.query(
                'UPDATE tentativas SET eventos_print = eventos_print + 1 WHERE id = ?',
                [tentativa_id]
            );
        }

        res.json({ message: 'Evento registrado com sucesso' });
    } catch (error) {
        console.error('Erro ao registrar evento suspeito:', error);
        res.status(500).json({ error: 'Erro ao registrar evento suspeito' });
    }
});

// Calcular score de suspeita
app.post('/api/tentativas/:id/calcular-score', async (req, res) => {
    try {
        const { id } = req.params;
        await promisePool.query('CALL calcular_score_suspeita(?)', [id]);

        const [result] = await promisePool.query(
            'SELECT score_suspeita FROM tentativas WHERE id = ?',
            [id]
        );

        res.json({
            score: result[0]?.score_suspeita || 0,
            message: 'Score calculado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao calcular score:', error);
        res.status(500).json({ error: 'Erro ao calcular score' });
    }
});

// Listar tentativas suspeitas
app.get('/api/tentativas-suspeitas', async (req, res) => {
    try {
        const { nivel } = req.query; // ALTO, MEDIO, BAIXO

        let query = 'SELECT * FROM tentativas_suspeitas WHERE 1=1';
        const params = [];

        if (nivel) {
            query += ' AND nivel_suspeita = ?';
            params.push(nivel);
        }

        query += ' ORDER BY score_suspeita DESC, finalizada_em DESC';

        const [rows] = await promisePool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar tentativas suspeitas:', error);
        res.status(500).json({ error: 'Erro ao buscar tentativas suspeitas' });
    }
});

// Análise detalhada de tentativa
app.get('/api/tentativas/:id/analise', async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar tentativa com score
        const [tentativas] = await promisePool.query(`
            SELECT t.*, p.titulo as prova_titulo, p.tempo_limite
            FROM tentativas t
            JOIN provas p ON t.prova_id = p.id
            WHERE t.id = ?
        `, [id]);

        if (tentativas.length === 0) {
            return res.status(404).json({ error: 'Tentativa não encontrada' });
        }

        const tentativa = tentativas[0];

        // Buscar eventos suspeitos
        const [eventos] = await promisePool.query(`
            SELECT * FROM eventos_suspeitos 
            WHERE tentativa_id = ? 
            ORDER BY timestamp ASC
        `, [id]);

        // Buscar tempo por questão
        const [tempos] = await promisePool.query(`
            SELECT 
                r.questao_id,
                q.enunciado,
                TIMESTAMPDIFF(SECOND, LAG(r.respondido_em) OVER (ORDER BY r.respondido_em), r.respondido_em) as tempo_segundos
            FROM respostas r
            JOIN questoes q ON r.questao_id = q.id
            WHERE r.tentativa_id = ?
            ORDER BY r.respondido_em
        `, [id]);

        // Calcular estatísticas de tempo
        const temposValidos = tempos.filter(t => t.tempo_segundos !== null);
        const tempoMedio = temposValidos.length > 0
            ? temposValidos.reduce((acc, t) => acc + t.tempo_segundos, 0) / temposValidos.length
            : 0;

        tentativa.eventos = eventos.map(e => ({
            ...e,
            detalhes: e.detalhes ? JSON.parse(e.detalhes) : null
        }));
        tentativa.tempo_por_questao = tempos;
        tentativa.tempo_medio_calculado = Math.round(tempoMedio);

        // Determinar nível de suspeita
        const score = tentativa.score_suspeita || 0;
        tentativa.nivel_suspeita = score >= 60 ? 'ALTO' : score >= 30 ? 'MEDIO' : 'BAIXO';
        tentativa.cor_suspeita = score >= 60 ? '🔴' : score >= 30 ? '🟡' : '🟢';

        res.json(tentativa);
    } catch (error) {
        console.error('Erro ao buscar análise:', error);
        res.status(500).json({ error: 'Erro ao buscar análise' });
    }
});

// ============================================
// ROTAS - ESTATÍSTICAS
// ============================================

// Dashboard com estatísticas gerais
// Dashboard com estatísticas gerais
app.get('/api/estatisticas/dashboard', async (req, res) => {
    const connection = await promisePool.getConnection();
    try {
        // Estatísticas Gerais (Query direta nas tabelas para garantir)
        const [stats] = await connection.query(`
            SELECT 
                (SELECT COUNT(*) FROM questoes) as total_questoes,
                (SELECT COUNT(*) FROM provas) as total_provas,
                (SELECT COUNT(*) FROM tentativas WHERE finalizado_em IS NOT NULL) as total_tentativas,
                (SELECT COUNT(DISTINCT nome_aluno) FROM tentativas) as total_alunos,
                (SELECT IFNULL(AVG(pontuacao), 0) FROM tentativas WHERE finalizado_em IS NOT NULL) as media_geral
        `);

        // Questões por tópico (Safely try view, fallback to empty array)
        let questoesPorTopico = [];
        try {
            const [rows] = await connection.query('SELECT * FROM v_questoes_por_topico');
            questoesPorTopico = rows;
        } catch (e) {
            console.warn('⚠️ Erro ao buscar v_questoes_por_topico (View pode estar faltando):', e.message);
        }

        // Top Alunos (Safely try view, fallback to empty array)
        let desempenhoAlunos = [];
        try {
            const [rows] = await connection.query('SELECT * FROM v_desempenho_alunos ORDER BY media_pontuacao DESC LIMIT 10');
            desempenhoAlunos = rows;
        } catch (e) {
            console.warn('⚠️ Erro ao buscar v_desempenho_alunos (View pode estar faltando):', e.message);
        }

        res.json({
            estatisticas_gerais: stats[0] || {
                total_questoes: 0,
                total_provas: 0,
                total_tentativas: 0,
                total_alunos: 0,
                media_geral: 0
            },
            questoes_por_topico: questoesPorTopico,
            top_alunos: desempenhoAlunos
        });
    } catch (error) {
        console.error('❌ Erro CRÍTICO ao buscar estatísticas:', error);
        res.status(500).json({
            error: 'Erro ao buscar estatísticas',
            details: error.message
        });
    } finally {
        connection.release();
    }
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
    console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`📝 API disponível em http://localhost:${PORT}/api`);

    const activePass = determineAdminPassword();
    console.log(`\n🔐 Senha de Admin (Produção/Local): ${activePass}`);
    console.log(`🔓 Acesso Local (localhost): Você também pode usar a senha 'admin'`);

    console.log(`\n💡 Pressione Ctrl+C para parar o servidor\n`);
});
