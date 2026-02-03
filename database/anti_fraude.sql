-- Script para adicionar sistema anti-fraude
-- Execute este script no MySQL Workbench

USE banco_questoes_estatistica;

-- 1. Criar tabela de eventos suspeitos
CREATE TABLE IF NOT EXISTS eventos_suspeitos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tentativa_id INT NOT NULL,
    tipo_evento VARCHAR(50) NOT NULL,
    detalhes TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tentativa_id) REFERENCES tentativas(id) ON DELETE CASCADE,
    INDEX idx_tentativa (tentativa_id),
    INDEX idx_tipo (tipo_evento),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB;

-- 2. Adicionar campos de análise na tabela tentativas (se não existirem)
-- Verificar e adicionar cada coluna individualmente

-- Adicionar total_perdas_foco
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'banco_questoes_estatistica' 
AND TABLE_NAME = 'tentativas' 
AND COLUMN_NAME = 'total_perdas_foco';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE tentativas ADD COLUMN total_perdas_foco INT DEFAULT 0', 
    'SELECT "Coluna total_perdas_foco já existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar tempo_medio_questao
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'banco_questoes_estatistica' 
AND TABLE_NAME = 'tentativas' 
AND COLUMN_NAME = 'tempo_medio_questao';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE tentativas ADD COLUMN tempo_medio_questao DECIMAL(10,2) DEFAULT NULL', 
    'SELECT "Coluna tempo_medio_questao já existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar score_suspeita
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'banco_questoes_estatistica' 
AND TABLE_NAME = 'tentativas' 
AND COLUMN_NAME = 'score_suspeita';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE tentativas ADD COLUMN score_suspeita INT DEFAULT 0', 
    'SELECT "Coluna score_suspeita já existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar eventos_print
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'banco_questoes_estatistica' 
AND TABLE_NAME = 'tentativas' 
AND COLUMN_NAME = 'eventos_print';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE tentativas ADD COLUMN eventos_print INT DEFAULT 0', 
    'SELECT "Coluna eventos_print já existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. Criar view para tentativas suspeitas
CREATE OR REPLACE VIEW tentativas_suspeitas AS
SELECT 
    t.id,
    t.nome_aluno,
    p.titulo as prova_titulo,
    t.pontuacao,
    t.trocas_aba,
    t.total_perdas_foco,
    t.eventos_print,
    t.tempo_total,
    t.tempo_medio_questao,
    t.score_suspeita,
    t.finalizado_em,
    COUNT(es.id) as total_eventos,
    CASE 
        WHEN t.score_suspeita >= 60 THEN 'ALTO'
        WHEN t.score_suspeita >= 30 THEN 'MEDIO'
        ELSE 'BAIXO'
    END as nivel_suspeita
FROM tentativas t
INNER JOIN provas p ON t.prova_id = p.id
LEFT JOIN eventos_suspeitos es ON t.id = es.tentativa_id
WHERE t.finalizado_em IS NOT NULL
GROUP BY t.id
ORDER BY t.score_suspeita DESC, t.finalizado_em DESC;

-- 4. Criar procedure para calcular score de suspeita
DROP PROCEDURE IF EXISTS calcular_score_suspeita;

DELIMITER //

CREATE PROCEDURE calcular_score_suspeita(IN p_tentativa_id INT)
BEGIN
    DECLARE v_score INT DEFAULT 0;
    DECLARE v_trocas_aba INT;
    DECLARE v_perdas_foco INT;
    DECLARE v_eventos_print INT;
    DECLARE v_tempo_medio DECIMAL(10,2);
    DECLARE v_tempo_total INT;
    DECLARE v_num_questoes INT;
    
    -- Buscar dados da tentativa
    SELECT 
        trocas_aba, 
        total_perdas_foco, 
        eventos_print,
        tempo_total,
        tempo_medio_questao
    INTO 
        v_trocas_aba, 
        v_perdas_foco, 
        v_eventos_print,
        v_tempo_total,
        v_tempo_medio
    FROM tentativas 
    WHERE id = p_tentativa_id;
    
    -- Calcular score baseado em eventos
    -- Trocas de aba: +10 por troca (máx 40)
    SET v_score = v_score + LEAST(v_trocas_aba * 10, 40);
    
    -- Perdas de foco: +5 por perda (máx 30)
    SET v_score = v_score + LEAST(v_perdas_foco * 5, 30);
    
    -- Tentativas de print: +15 por tentativa (máx 30)
    SET v_score = v_score + LEAST(v_eventos_print * 15, 30);
    
    -- Tempo anormal: +20 se muito rápido (< 30s por questão em média)
    IF v_tempo_medio IS NOT NULL AND v_tempo_medio < 30 THEN
        SET v_score = v_score + 20;
    END IF;
    
    -- Atualizar score
    UPDATE tentativas 
    SET score_suspeita = LEAST(v_score, 100)
    WHERE id = p_tentativa_id;
END //

DELIMITER ;

-- 5. Verificar estrutura
SHOW COLUMNS FROM tentativas;
SHOW COLUMNS FROM eventos_suspeitos;
SELECT * FROM tentativas_suspeitas LIMIT 5;
