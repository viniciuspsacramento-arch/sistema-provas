-- ============================================
-- Dados de Exemplo (Seed)
-- Sistema de Banco de Questões de Estatística
-- ============================================

USE banco_questoes_estatistica;

-- ============================================
-- Tópicos de Estatística
-- ============================================

INSERT INTO topicos (nome, descricao) VALUES
('Estatística Descritiva', 'Medidas de tendência central, dispersão e visualização de dados'),
('Probabilidade', 'Teoria de probabilidade, eventos, probabilidade condicional'),
('Distribuições de Probabilidade', 'Distribuições discretas e contínuas (Normal, Binomial, Poisson, etc)'),
('Inferência Estatística', 'Estimação, intervalos de confiança e testes de hipóteses'),
('Regressão e Correlação', 'Análise de regressão linear, correlação e modelos estatísticos');

-- ============================================
-- Tags
-- ============================================

INSERT INTO tags (nome) VALUES
('média'),
('mediana'),
('variância'),
('desvio-padrão'),
('distribuição-normal'),
('teste-hipótese'),
('intervalo-confiança'),
('regressão-linear'),
('correlação'),
('probabilidade-condicional'),
('teorema-bayes'),
('combinatória'),
('amostragem');

-- ============================================
-- Questões de Exemplo (Texto)
-- ============================================

-- Questão 1: Estatística Descritiva
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Considere o conjunto de dados: 10, 15, 20, 25, 30. Qual é a média aritmética deste conjunto?', 1, 'facil', 'multipla_escolha', FALSE);

SET @questao1_id = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@questao1_id, '15', FALSE, 1),
(@questao1_id, '20', TRUE, 2),
(@questao1_id, '25', FALSE, 3),
(@questao1_id, '30', FALSE, 4);

INSERT INTO questoes_tags (questao_id, tag_id) VALUES
(@questao1_id, (SELECT id FROM tags WHERE nome = 'média'));

-- Questão 2: Probabilidade
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Ao lançar um dado honesto de 6 faces, qual é a probabilidade de obter um número par?', 2, 'facil', 'multipla_escolha', FALSE);

SET @questao2_id = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@questao2_id, '1/6', FALSE, 1),
(@questao2_id, '1/3', FALSE, 2),
(@questao2_id, '1/2', TRUE, 3),
(@questao2_id, '2/3', FALSE, 4);

-- Questão 3: Distribuições
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Em uma distribuição normal padrão (μ=0, σ=1), aproximadamente que porcentagem dos dados está dentro de 1 desvio padrão da média?', 3, 'medio', 'multipla_escolha', FALSE);

SET @questao3_id = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@questao3_id, '50%', FALSE, 1),
(@questao3_id, '68%', TRUE, 2),
(@questao3_id, '95%', FALSE, 3),
(@questao3_id, '99.7%', FALSE, 4);

INSERT INTO questoes_tags (questao_id, tag_id) VALUES
(@questao3_id, (SELECT id FROM tags WHERE nome = 'distribuição-normal')),
(@questao3_id, (SELECT id FROM tags WHERE nome = 'desvio-padrão'));

-- Questão 4: Inferência Estatística
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('O que representa o nível de confiança de 95% em um intervalo de confiança?', 4, 'medio', 'multipla_escolha', FALSE);

SET @questao4_id = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@questao4_id, 'A probabilidade de o parâmetro estar no intervalo', FALSE, 1),
(@questao4_id, 'A proporção de intervalos que conteriam o parâmetro em amostras repetidas', TRUE, 2),
(@questao4_id, 'A certeza absoluta de que o parâmetro está no intervalo', FALSE, 3),
(@questao4_id, 'O erro máximo permitido na estimativa', FALSE, 4);

INSERT INTO questoes_tags (questao_id, tag_id) VALUES
(@questao4_id, (SELECT id FROM tags WHERE nome = 'intervalo-confiança'));

-- Questão 5: Regressão
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Em uma análise de regressão linear simples, o coeficiente de determinação R² = 0.81 indica que:', 5, 'medio', 'multipla_escolha', FALSE);

SET @questao5_id = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@questao5_id, '81% da variação em Y é explicada por X', TRUE, 1),
(@questao5_id, 'A correlação entre X e Y é 0.81', FALSE, 2),
(@questao5_id, 'O modelo tem 81% de precisão', FALSE, 3),
(@questao5_id, '19% dos dados são outliers', FALSE, 4);

INSERT INTO questoes_tags (questao_id, tag_id) VALUES
(@questao5_id, (SELECT id FROM tags WHERE nome = 'regressão-linear')),
(@questao5_id, (SELECT id FROM tags WHERE nome = 'correlação'));

-- Questão 6: Probabilidade Condicional
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Em uma urna há 5 bolas vermelhas e 3 bolas azuis. Retirando duas bolas sem reposição, qual a probabilidade de a segunda ser vermelha dado que a primeira foi vermelha?', 2, 'dificil', 'multipla_escolha', FALSE);

SET @questao6_id = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@questao6_id, '5/8', FALSE, 1),
(@questao6_id, '4/7', TRUE, 2),
(@questao6_id, '5/7', FALSE, 3),
(@questao6_id, '1/2', FALSE, 4);

INSERT INTO questoes_tags (questao_id, tag_id) VALUES
(@questao6_id, (SELECT id FROM tags WHERE nome = 'probabilidade-condicional'));

-- Questão 7: Medidas de Dispersão
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Dois conjuntos de dados A e B têm a mesma média. Se o desvio padrão de A é maior que o de B, podemos afirmar que:', 1, 'medio', 'multipla_escolha', FALSE);

SET @questao7_id = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@questao7_id, 'Os dados de A estão mais dispersos em torno da média', TRUE, 1),
(@questao7_id, 'Os dados de B têm valores maiores', FALSE, 2),
(@questao7_id, 'A média de A é menos confiável', FALSE, 3),
(@questao7_id, 'B tem mais outliers que A', FALSE, 4);

INSERT INTO questoes_tags (questao_id, tag_id) VALUES
(@questao7_id, (SELECT id FROM tags WHERE nome = 'desvio-padrão')),
(@questao7_id, (SELECT id FROM tags WHERE nome = 'variância'));

-- Questão 8: Teste de Hipóteses
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Em um teste de hipóteses, o valor-p (p-value) de 0.03 com nível de significância α = 0.05 indica que devemos:', 4, 'medio', 'multipla_escolha', FALSE);

SET @questao8_id = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@questao8_id, 'Rejeitar a hipótese nula', TRUE, 1),
(@questao8_id, 'Não rejeitar a hipótese nula', FALSE, 2),
(@questao8_id, 'Aceitar a hipótese alternativa com certeza', FALSE, 3),
(@questao8_id, 'Refazer o teste com mais dados', FALSE, 4);

INSERT INTO questoes_tags (questao_id, tag_id) VALUES
(@questao8_id, (SELECT id FROM tags WHERE nome = 'teste-hipótese'));

-- Questão 9: Combinatória
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('De quantas maneiras diferentes podemos escolher 3 pessoas de um grupo de 10 para formar uma comissão?', 2, 'medio', 'multipla_escolha', FALSE);

SET @questao9_id = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@questao9_id, '30', FALSE, 1),
(@questao9_id, '120', TRUE, 2),
(@questao9_id, '720', FALSE, 3),
(@questao9_id, '1000', FALSE, 4);

INSERT INTO questoes_tags (questao_id, tag_id) VALUES
(@questao9_id, (SELECT id FROM tags WHERE nome = 'combinatória'));

-- Questão 10: Mediana
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Considere o conjunto: 5, 12, 8, 15, 20, 3, 9. Qual é a mediana?', 1, 'facil', 'multipla_escolha', FALSE);

SET @questao10_id = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@questao10_id, '8', FALSE, 1),
(@questao10_id, '9', TRUE, 2),
(@questao10_id, '10', FALSE, 3),
(@questao10_id, '12', FALSE, 4);

INSERT INTO questoes_tags (questao_id, tag_id) VALUES
(@questao10_id, (SELECT id FROM tags WHERE nome = 'mediana'));

-- ============================================
-- Provas de Exemplo
-- ============================================

-- Prova 1: Avaliação Básica de Estatística
INSERT INTO provas (titulo, descricao, tempo_limite) VALUES
('Avaliação Básica de Estatística', 'Prova introdutória cobrindo conceitos fundamentais de estatística descritiva e probabilidade', 60);

SET @prova1_id = LAST_INSERT_ID();

-- Adicionar questões à prova
INSERT INTO provas_questoes (prova_id, questao_id, ordem) VALUES
(@prova1_id, @questao1_id, 1),
(@prova1_id, @questao2_id, 2),
(@prova1_id, @questao7_id, 3),
(@prova1_id, @questao10_id, 4),
(@prova1_id, @questao9_id, 5);

-- Prova 2: Inferência e Distribuições
INSERT INTO provas (titulo, descricao, tempo_limite) VALUES
('Inferência Estatística e Distribuições', 'Avaliação sobre distribuições de probabilidade e inferência estatística', 90);

SET @prova2_id = LAST_INSERT_ID();

INSERT INTO provas_questoes (prova_id, questao_id, ordem) VALUES
(@prova2_id, @questao3_id, 1),
(@prova2_id, @questao4_id, 2),
(@prova2_id, @questao8_id, 3),
(@prova2_id, @questao6_id, 4);

-- ============================================
-- Tentativas de Exemplo (para demonstração)
-- ============================================

-- Tentativa 1
INSERT INTO tentativas (prova_id, nome_aluno, finalizado_em, trocas_aba, tempo_total) VALUES
(@prova1_id, 'João Silva', DATE_ADD(NOW(), INTERVAL -2 DAY), 0, 2400);

SET @tentativa1_id = LAST_INSERT_ID();

-- Respostas da tentativa 1 (4 corretas de 5)
INSERT INTO respostas (tentativa_id, questao_id, alternativa_id) VALUES
(@tentativa1_id, @questao1_id, (SELECT id FROM alternativas WHERE questao_id = @questao1_id AND correta = TRUE)),
(@tentativa1_id, @questao2_id, (SELECT id FROM alternativas WHERE questao_id = @questao2_id AND correta = TRUE)),
(@tentativa1_id, @questao7_id, (SELECT id FROM alternativas WHERE questao_id = @questao7_id AND correta = TRUE)),
(@tentativa1_id, @questao10_id, (SELECT id FROM alternativas WHERE questao_id = @questao10_id AND correta = FALSE LIMIT 1)),
(@tentativa1_id, @questao9_id, (SELECT id FROM alternativas WHERE questao_id = @questao9_id AND correta = TRUE));

-- Calcular pontuação
CALL calcular_pontuacao(@tentativa1_id);

-- Tentativa 2
INSERT INTO tentativas (prova_id, nome_aluno, finalizado_em, trocas_aba, tempo_total) VALUES
(@prova1_id, 'Maria Santos', DATE_ADD(NOW(), INTERVAL -1 DAY), 2, 3000);

SET @tentativa2_id = LAST_INSERT_ID();

-- Respostas da tentativa 2 (5 corretas de 5)
INSERT INTO respostas (tentativa_id, questao_id, alternativa_id) VALUES
(@tentativa2_id, @questao1_id, (SELECT id FROM alternativas WHERE questao_id = @questao1_id AND correta = TRUE)),
(@tentativa2_id, @questao2_id, (SELECT id FROM alternativas WHERE questao_id = @questao2_id AND correta = TRUE)),
(@tentativa2_id, @questao7_id, (SELECT id FROM alternativas WHERE questao_id = @questao7_id AND correta = TRUE)),
(@tentativa2_id, @questao10_id, (SELECT id FROM alternativas WHERE questao_id = @questao10_id AND correta = TRUE)),
(@tentativa2_id, @questao9_id, (SELECT id FROM alternativas WHERE questao_id = @questao9_id AND correta = TRUE));

CALL calcular_pontuacao(@tentativa2_id);

-- ============================================
-- Verificação dos dados inseridos
-- ============================================

-- Mostrar estatísticas
SELECT 'Dados inseridos com sucesso!' AS status;
SELECT COUNT(*) AS total_topicos FROM topicos;
SELECT COUNT(*) AS total_questoes FROM questoes;
SELECT COUNT(*) AS total_tags FROM tags;
SELECT COUNT(*) AS total_provas FROM provas;
SELECT COUNT(*) AS total_tentativas FROM tentativas;

-- Mostrar questões por tópico
SELECT * FROM v_questoes_por_topico;

-- Mostrar desempenho dos alunos
SELECT * FROM v_desempenho_alunos;
