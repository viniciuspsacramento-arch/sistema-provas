-- Script para limpar TODOS os tópicos duplicados e adicionar novo tópico
-- Execute este script no MySQL Workbench

USE banco_questoes_estatistica;

-- Desabilitar modo de atualização segura temporariamente
SET SQL_SAFE_UPDATES = 0;

-- 1. Identificar e corrigir referências de questões para tópicos duplicados
-- Para cada nome de tópico duplicado, manter apenas o primeiro ID
CREATE TEMPORARY TABLE topicos_manter AS
SELECT nome, MIN(id) as id_manter
FROM topicos
GROUP BY nome;

-- Atualizar questões que apontam para IDs duplicados
UPDATE questoes q
INNER JOIN topicos t ON q.topico_id = t.id
INNER JOIN topicos_manter tm ON t.nome = tm.nome
SET q.topico_id = tm.id_manter
WHERE q.topico_id != tm.id_manter;

-- 2. Deletar tópicos duplicados (mantém apenas o primeiro de cada nome)
DELETE t1 FROM topicos t1
INNER JOIN topicos t2 
WHERE t1.id > t2.id AND t1.nome = t2.nome;

-- Limpar tabela temporária
DROP TEMPORARY TABLE topicos_manter;

-- Reabilitar modo de atualização segura
SET SQL_SAFE_UPDATES = 1;

-- 3. Adicionar novo tópico apenas se não existir
INSERT INTO topicos (nome, descricao)
SELECT * FROM (SELECT 'Distribuição de Probabilidade (Binomial)', 'Distribuição binomial e suas aplicações') AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM topicos WHERE nome = 'Distribuição de Probabilidade (Binomial)'
) LIMIT 1;

-- 4. Verificar tópicos únicos (resultado final)
SELECT id, nome, descricao, criado_em 
FROM topicos 
ORDER BY nome;

-- 5. Contar questões por tópico
SELECT t.nome, COUNT(q.id) as total_questoes
FROM topicos t
LEFT JOIN questoes q ON t.id = q.topico_id
GROUP BY t.id, t.nome
ORDER BY t.nome;
