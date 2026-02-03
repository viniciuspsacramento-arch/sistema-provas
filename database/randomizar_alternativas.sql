-- =================================================================================
-- Script para Randomizar a Ordem das Alternativas de TODAS as Questões
-- =================================================================================
-- Este script embaralha a posição das alternativas para que as respostas
-- corretas não fiquem sempre na mesma posição.
-- =================================================================================

USE banco_questoes_estatistica;

-- Desabilitar verificações de chave estrangeira temporariamente
SET FOREIGN_KEY_CHECKS = 0;

-- Criar tabela temporária para armazenar a nova ordem
DROP TEMPORARY TABLE IF EXISTS temp_nova_ordem;
CREATE TEMPORARY TABLE temp_nova_ordem AS
SELECT 
    id,
    questao_id,
    texto,
    correta,
    ROW_NUMBER() OVER (
        PARTITION BY questao_id 
        ORDER BY RAND()
    ) AS nova_ordem
FROM alternativas;

-- Atualizar a ordem das alternativas
UPDATE alternativas a
JOIN temp_nova_ordem t ON a.id = t.id
SET a.ordem = t.nova_ordem;

-- Limpar tabela temporária
DROP TEMPORARY TABLE IF EXISTS temp_nova_ordem;

-- Reabilitar verificações de chave estrangeira
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar a distribuição das respostas corretas
SELECT 
    ordem AS 'Posição (Letra)',
    COUNT(*) AS 'Qtd Corretas',
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM alternativas WHERE correta = 1), 1) AS 'Percentual'
FROM alternativas 
WHERE correta = 1 
GROUP BY ordem 
ORDER BY ordem;

SELECT 'Ordem das alternativas randomizada com sucesso!' AS status;
