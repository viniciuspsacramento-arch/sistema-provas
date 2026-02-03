USE banco_questoes_estatistica;

-- Garantir que o tópico existe com o nome EXATO solicitado
INSERT INTO topicos (nome, descricao) 
SELECT 'Distribuição de probabilidade (Normal)', 'Cálculos de probabilidade e escore-z usando a curva normal'
WHERE NOT EXISTS (SELECT 1 FROM topicos WHERE nome = 'Distribuição de probabilidade (Normal)');

SET @topico_normal = (SELECT id FROM topicos WHERE nome = 'Distribuição de probabilidade (Normal)' LIMIT 1);

-- =================================================================================
-- Questão 21: Altura de Porta (Disney/Boeing) - Contexto
-- Homens: N(69.0, 2.8), Mulheres: N(63.6, 2.5), Porta: 72 pol
-- =================================================================================

-- 21a: Homens passando sem se curvar
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('O bonde Mark VI da Disney World e o avião Boeing 757-200 ER têm portas com altura de 72 polegadas. Sabendo que a altura dos homens segue uma distribuição normal com média 69,0 pol e desvio padrão 2,8 pol, qual a porcentagem de homens que podem passar pela porta sem se curvar?', 
@topico_normal, 'facil', 'multipla_escolha');
SET @qid = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid, '85,77%', 1, 1),
(@qid, '14,23%', 0, 2), -- CoMplementar erro comum
(@qid, '99,96%', 0, 3), -- Valor das mulheres (confusão)
(@qid, '68,00%', 0, 4), -- 1 desvio padrão (regra empírica)
(@qid, '92,34%', 0, 5); -- Valor aleatório próximo

-- 21b: Mulheres passando sem se curvar
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('Considerando portas de 72 polegadas e que a altura das mulheres segue uma distribuição normal com média 63,6 pol e desvio padrão 2,5 pol, qual a porcentagem de mulheres que podem passar sem se curvar?', 
@topico_normal, 'facil', 'multipla_escolha');
SET @qid = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid, '99,96%', 1, 1),
(@qid, '0,04%', 0, 2),
(@qid, '85,77%', 0, 3),
(@qid, '95,44%', 0, 4),
(@qid, '100% (arredondado exato)', 0, 5);

-- 21d: Altura para 98% dos homens
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('Qual deveria ser a altura da porta para permitir que 98% dos homens adultos (Média 69,0 pol, Desvio 2,8 pol) passassem sem se curvar?', 
@topico_normal, 'medio', 'multipla_escolha');
SET @qid = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid, '74,75 polegadas', 1, 1),
(@qid, '72,00 polegadas', 0, 2),
(@qid, '63,25 polegadas', 0, 3),
(@qid, '71,80 polegadas', 0, 4),
(@qid, '80,00 polegadas', 0, 5);

-- =================================================================================
-- Questão 22: Altura de Porta (Gulfstream 100) - Contexto
-- Porta: 51.6 pol
-- =================================================================================

-- 22a: Homens passando (Quase 0)
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('O jato executivo Gulfstream 100 tem uma porta de apenas 51,6 polegadas de altura. Qual a porcentagem de homens (Média 69,0, Desvio 2,8) que conseguem passar sem se curvar?', 
@topico_normal, 'facil', 'multipla_escolha');
SET @qid = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid, 'Aproximadamente 0%', 1, 1),
(@qid, 'Aproximadamente 5%', 0, 2),
(@qid, 'Aproximadamente 10%', 0, 3),
(@qid, '50%', 0, 4),
(@qid, '1,5%', 0, 5);

-- 22d: Altura para 99% dos homens
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('No caso do Gulfstream, qual altura de porta seria necessária para acomodar 99% dos homens adultos (Média 69,0, Desvio 2,8)?', 
@topico_normal, 'medio', 'multipla_escolha');
SET @qid = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid, '75,52 polegadas', 1, 1),
(@qid, '72,00 polegadas', 0, 2),
(@qid, '78,40 polegadas', 0, 3),
(@qid, '69,00 polegadas', 0, 4),
(@qid, '81,20 polegadas', 0, 5);

-- =================================================================================
-- Questão 23: Tall Clubs International
-- Req: Homens >= 74, Mulheres >= 70
-- =================================================================================

-- 23a: Porcentagem de Homens
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('O Tall Clubs International exige que homens tenham pelo menos 74 polegadas de altura. Qual porcentagem de homens (Média 69,0, DP 2,8) satisfaz essa exigência?', 
@topico_normal, 'medio', 'multipla_escolha');
SET @qid = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid, '3,67%', 1, 1),
(@qid, '96,33%', 0, 2), -- Cauda errada
(@qid, '5,00%', 0, 3),
(@qid, '0,52%', 0, 4), -- Valor das mulheres
(@qid, '1,79%', 0, 5); -- Valor do Z-score

-- 23b: Porcentagem de Mulheres
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('O Tall Clubs International exige que mulheres tenham pelo menos 70 polegadas de altura. Qual porcentagem de mulheres (Média 63,6, DP 2,5) satisfaz essa exigência?', 
@topico_normal, 'medio', 'multipla_escolha');
SET @qid = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid, '0,52%', 1, 1),
(@qid, '99,48%', 0, 2),
(@qid, '3,67%', 0, 3),
(@qid, '2,56%', 0, 4), -- Valor do Z-score
(@qid, '1,00%', 0, 5);

-- =================================================================================
-- Questão 24: Tall Clubs International (Novos Requisitos - Top 4%)
-- =================================================================================

-- 24a/b Combined concept or separate? Let's do separate calculation ones.
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('Se o Tall Clubs International decidisse alterar suas regras para aceitar apenas os 4% homens mais altos e as 4% mulheres mais altas, quais seriam, aproximadamente, as novas alturas mínimas exigidas? (Homens: N(69, 2.8), Mulheres: N(63.6, 2.5))', 
@topico_normal, 'dificil', 'multipla_escolha');
SET @qid = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid, 'Homens: 73,9 pol; Mulheres: 68,0 pol', 1, 1),
(@qid, 'Homens: 74,0 pol; Mulheres: 70,0 pol', 0, 2),
(@qid, 'Homens: 72,5 pol; Mulheres: 66,8 pol', 0, 3),
(@qid, 'Homens: 75,5 pol; Mulheres: 69,5 pol', 0, 4),
(@qid, 'Homens: 71,8 pol; Mulheres: 65,0 pol', 0, 5);

-- =================================================================================
-- Questão 25: Forças Armadas (Mulheres)
-- Entre 58 e 80
-- =================================================================================

INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('As Forças Armadas exigem que mulheres tenham altura entre 58 e 80 polegadas. Dada a distribuição N(63.6, 2.5), qual a porcentagem de mulheres aptas?', 
@topico_normal, 'medio', 'multipla_escolha');
SET @qid = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid, '98,75%', 1, 1),
(@qid, '1,25%', 0, 2),
(@qid, '95,00%', 0, 3),
(@qid, '99,99%', 0, 4),
(@qid, '87,50%', 0, 5);

-- =================================================================================
-- Questão 27: Pesos ao Nascer
-- Média 3570g, DP 500g. Leitos < 2700g
-- =================================================================================

INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('Os pesos ao nascer são normalmente distribuídos com média 3570g e desvio padrão 500g. Se um hospital planeja leitos especiais para bebês com menos de 2700g, qual porcentagem de nascimentos exigirá esses leitos?', 
@topico_normal, 'facil', 'multipla_escolha');
SET @qid = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid, '4,09%', 1, 1),
(@qid, '95,91%', 0, 2),
(@qid, '2,50%', 0, 3),
(@qid, '8,50%', 0, 4),
(@qid, '1,74%', 0, 5); -- Z-score

SELECT 'Questões 21-27 (subdividas) inseridas com sucesso no tópico Distribuição de probabilidade (Normal)!' AS status;
