-- ============================================
-- Sistema de Banco de Questões de Estatística
-- Schema do Banco de Dados MySQL
-- ============================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS banco_questoes_estatistica
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE banco_questoes_estatistica;

-- ============================================
-- Tabela: topicos
-- Armazena os tópicos de estatística
-- ============================================
CREATE TABLE topicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nome (nome)
) ENGINE=InnoDB;

-- ============================================
-- Tabela: questoes
-- Armazena as questões (com suporte a imagens)
-- ============================================
CREATE TABLE questoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    enunciado TEXT COMMENT 'Texto da questão (opcional se usar imagem)',
    enunciado_imagem VARCHAR(255) COMMENT 'Caminho da imagem do enunciado',
    topico_id INT NOT NULL,
    dificuldade ENUM('facil', 'medio', 'dificil') NOT NULL DEFAULT 'medio',
    tipo ENUM('multipla_escolha', 'verdadeiro_falso', 'dissertativa') NOT NULL DEFAULT 'multipla_escolha',
    usa_imagem BOOLEAN DEFAULT FALSE COMMENT 'Se a questão usa imagem ao invés de texto',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (topico_id) REFERENCES topicos(id) ON DELETE RESTRICT,
    INDEX idx_topico (topico_id),
    INDEX idx_dificuldade (dificuldade),
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB;

-- ============================================
-- Tabela: alternativas
-- Armazena as alternativas das questões
-- ============================================
CREATE TABLE alternativas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    questao_id INT NOT NULL,
    texto TEXT COMMENT 'Texto da alternativa (opcional se usar imagem)',
    imagem VARCHAR(255) COMMENT 'Caminho da imagem da alternativa',
    correta BOOLEAN DEFAULT FALSE,
    ordem INT NOT NULL COMMENT 'Ordem de exibição (1=A, 2=B, 3=C, etc)',
    FOREIGN KEY (questao_id) REFERENCES questoes(id) ON DELETE CASCADE,
    INDEX idx_questao (questao_id)
) ENGINE=InnoDB;

-- ============================================
-- Tabela: tags
-- Tags para categorização adicional
-- ============================================
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nome (nome)
) ENGINE=InnoDB;

-- ============================================
-- Tabela: questoes_tags
-- Relacionamento N:N entre questões e tags
-- ============================================
CREATE TABLE questoes_tags (
    questao_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (questao_id, tag_id),
    FOREIGN KEY (questao_id) REFERENCES questoes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- Tabela: provas
-- Armazena as provas criadas
-- ============================================
CREATE TABLE provas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    tempo_limite INT COMMENT 'Tempo em minutos (NULL = sem limite)',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_titulo (titulo)
) ENGINE=InnoDB;

-- ============================================
-- Tabela: provas_questoes
-- Relacionamento N:N entre provas e questões
-- ============================================
CREATE TABLE provas_questoes (
    prova_id INT NOT NULL,
    questao_id INT NOT NULL,
    ordem INT NOT NULL COMMENT 'Ordem da questão na prova',
    PRIMARY KEY (prova_id, questao_id),
    FOREIGN KEY (prova_id) REFERENCES provas(id) ON DELETE CASCADE,
    FOREIGN KEY (questao_id) REFERENCES questoes(id) ON DELETE RESTRICT,
    INDEX idx_ordem (prova_id, ordem)
) ENGINE=InnoDB;

-- ============================================
-- Tabela: tentativas
-- Histórico de provas realizadas
-- ============================================
CREATE TABLE tentativas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prova_id INT NOT NULL,
    nome_aluno VARCHAR(100) NOT NULL,
    iniciado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finalizado_em TIMESTAMP NULL,
    pontuacao DECIMAL(5,2) COMMENT 'Pontuação final (0-100)',
    trocas_aba INT DEFAULT 0 COMMENT 'Contador de vezes que saiu da aba',
    tempo_total INT COMMENT 'Tempo total em segundos',
    FOREIGN KEY (prova_id) REFERENCES provas(id) ON DELETE RESTRICT,
    INDEX idx_prova (prova_id),
    INDEX idx_aluno (nome_aluno),
    INDEX idx_data (iniciado_em)
) ENGINE=InnoDB;

-- ============================================
-- Tabela: respostas
-- Respostas dadas pelos alunos
-- ============================================
CREATE TABLE respostas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tentativa_id INT NOT NULL,
    questao_id INT NOT NULL,
    alternativa_id INT COMMENT 'NULL para questões dissertativas',
    resposta_texto TEXT COMMENT 'Para questões dissertativas',
    correta BOOLEAN COMMENT 'Se a resposta está correta (calculado automaticamente)',
    respondido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tentativa_id) REFERENCES tentativas(id) ON DELETE CASCADE,
    FOREIGN KEY (questao_id) REFERENCES questoes(id) ON DELETE RESTRICT,
    FOREIGN KEY (alternativa_id) REFERENCES alternativas(id) ON DELETE RESTRICT,
    INDEX idx_tentativa (tentativa_id),
    INDEX idx_questao (questao_id)
) ENGINE=InnoDB;

-- ============================================
-- Views úteis
-- ============================================

-- View: Estatísticas de questões por tópico
CREATE VIEW v_questoes_por_topico AS
SELECT 
    t.id,
    t.nome AS topico,
    COUNT(q.id) AS total_questoes,
    SUM(CASE WHEN q.dificuldade = 'facil' THEN 1 ELSE 0 END) AS faceis,
    SUM(CASE WHEN q.dificuldade = 'medio' THEN 1 ELSE 0 END) AS medias,
    SUM(CASE WHEN q.dificuldade = 'dificil' THEN 1 ELSE 0 END) AS dificeis
FROM topicos t
LEFT JOIN questoes q ON t.id = q.topico_id
GROUP BY t.id, t.nome;

-- View: Desempenho dos alunos
CREATE VIEW v_desempenho_alunos AS
SELECT 
    t.nome_aluno,
    COUNT(DISTINCT t.id) AS total_provas,
    AVG(t.pontuacao) AS media_pontuacao,
    AVG(t.trocas_aba) AS media_trocas_aba,
    AVG(t.tempo_total) AS tempo_medio_segundos
FROM tentativas t
WHERE t.finalizado_em IS NOT NULL
GROUP BY t.nome_aluno;

-- ============================================
-- Procedures úteis
-- ============================================

DELIMITER //

-- Procedure: Calcular pontuação de uma tentativa
CREATE PROCEDURE calcular_pontuacao(IN p_tentativa_id INT)
BEGIN
    DECLARE v_total_questoes INT;
    DECLARE v_respostas_corretas INT;
    DECLARE v_pontuacao DECIMAL(5,2);
    
    -- Contar total de questões da prova
    SELECT COUNT(DISTINCT pq.questao_id) INTO v_total_questoes
    FROM tentativas t
    JOIN provas_questoes pq ON t.prova_id = pq.prova_id
    WHERE t.id = p_tentativa_id;
    
    -- Contar respostas corretas
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
END //

DELIMITER ;

-- ============================================
-- Triggers
-- ============================================

DELIMITER //

-- Trigger: Verificar se resposta está correta ao inserir
CREATE TRIGGER tr_verificar_resposta_correta
BEFORE INSERT ON respostas
FOR EACH ROW
BEGIN
    IF NEW.alternativa_id IS NOT NULL THEN
        SELECT correta INTO NEW.correta
        FROM alternativas
        WHERE id = NEW.alternativa_id;
    END IF;
END //

DELIMITER ;

-- ============================================
-- Índices adicionais para performance
-- ============================================

-- Índice composto para busca de questões
CREATE INDEX idx_questoes_busca ON questoes(topico_id, dificuldade, tipo);

-- Índice para ordenação de tentativas
CREATE INDEX idx_tentativas_ordenacao ON tentativas(prova_id, iniciado_em DESC);

-- ============================================
-- Comentários nas tabelas
-- ============================================

ALTER TABLE questoes COMMENT = 'Armazena questões com suporte a imagens para dificultar consultas à IA';
ALTER TABLE tentativas COMMENT = 'Registra tentativas de provas incluindo monitoramento de comportamento';
ALTER TABLE respostas COMMENT = 'Armazena respostas dos alunos com verificação automática de correção';
