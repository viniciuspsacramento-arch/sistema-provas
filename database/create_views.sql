-- ============================================
-- Criar Views para o Dashboard
-- ============================================

-- View: Questões por tópico com contagens por dificuldade
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
ORDER BY total_questoes DESC;

-- View: Desempenho dos alunos
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
ORDER BY media_pontuacao DESC;
