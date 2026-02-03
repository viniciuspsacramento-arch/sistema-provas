USE banco_questoes_estatistica;

SET @topico_normal = (SELECT id FROM topicos WHERE nome = 'Distribuição de probabilidade (Normal)' LIMIT 1);

-- =================================================================================
-- Contexto Geral: QI de Adultos
-- Média = 100, Desvio Padrão = 15
-- Regra do Valor Usual: [Média - 2*DP, Média + 2*DP] = [70, 130]
-- =================================================================================

-- Questão 17: P(X > 115) e análise de valor usual
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('Os escores de QI de adultos são normalmente distribuídos com média 100 e desvio padrão 15. Encontre a probabilidade de um adulto selecionado aleatoriamente ter um QI maior que 115. Além disso, um QI de 115 é considerado "não usual" de acordo com a regra experimental (intervalo de ±2 desvios padrões)?', 
@topico_normal, 'medio', 'multipla_escolha');
SET @qid = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid, 'Probabilidade: 15,87%; O valor é considerado usual (está dentro do intervalo 70-130).', 1, 1),
(@qid, 'Probabilidade: 84,13%; O valor é considerado não usual (é muito alto).', 0, 2),
(@qid, 'Probabilidade: 15,87%; O valor é considerado não usual.', 0, 3),
(@qid, 'Probabilidade: 34,13%; O valor é considerado usual.', 0, 4),
(@qid, 'Probabilidade: 25,00%; O valor é limiar de não usual.', 0, 5);

-- Questão 18: P(X < 85) e análise de valor usual
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('Utilizando os mesmos dados (QI: μ=100, σ=15), qual a probabilidade de um adulto ter QI menor que 85? Esse valor (85) é classificado como não usual?', 
@topico_normal, 'medio', 'multipla_escolha');
SET @qid = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid, '15,87%; Classificado como usual.', 1, 1),
(@qid, '84,13%; Classificado como usual.', 0, 2),
(@qid, '5,00%; Classificado como não usual (muito baixo).', 0, 3),
(@qid, '15,87%; Classificado como não usual porque está abaixo da média.', 0, 4),
(@qid, '13,50%; Classificado como usual.', 0, 5);

-- Questão 19: P(110 < X < 140) e análise de valor usual
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('Qual a probabilidade de um adulto ter um QI entre 110 e 140? Dentre esses limites, o valor 140 é considerado usual?', 
@topico_normal, 'dificil', 'multipla_escolha');
SET @qid = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid, '24,87%; Não, 140 é não usual (excede o limite superior de 130).', 1, 1),
(@qid, '24,87%; Sim, 140 ainda é considerado usual.', 0, 2),
(@qid, '74,75%; Não, ambos são não usuais.', 0, 3),
(@qid, '18,50%; Sim, pois está dentro de 3 desvios padrões.', 0, 4),
(@qid, '49,60%; Não, 140 é um outlier extremo.', 0, 5);

SELECT 'Questões 17, 18 e 19 (QI + Valor Usual) inseridas com sucesso!' AS status;
