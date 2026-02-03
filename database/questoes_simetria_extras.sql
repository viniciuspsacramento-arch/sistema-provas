USE banco_questoes_estatistica;

SET @topico_descritiva = (SELECT id FROM topicos WHERE nome = 'Estatística descritiva (exploração e comparação de dados)' LIMIT 1);

-- =================================================================================
-- Questão 4: Diagnóstico de Assimetria Negativa (à esquerda)
-- =================================================================================
-- Dados: Min=5, Q1=35, Q2=45, Q3=55, Max=60
-- Análise do miolo: Q2-Q1 = 45-35 = 10, Q3-Q2 = 55-45 = 10 → SIMÉTRICO
-- Análise das caudas: Q1-Min = 35-5 = 30, Max-Q3 = 60-55 = 5 → CAUDA ESQUERDA MAIOR
-- Conclusão: Assimetria NEGATIVA (à esquerda)

INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Em um conjunto de dados sobre tempo de resposta (em segundos) de um servidor, obteve-se o seguinte Resumo dos 5 Números: Mínimo=5, Q1=35, Mediana=45, Q3=55, Máximo=60. Analise as distâncias entre os quartis ($Q_2 - Q_1$ vs $Q_3 - Q_2$) e as distâncias dos extremos ($Q_1 - Min$ vs $Max - Q_3$) para diagnosticar a simetria. Qual é a conclusão correta?', 
@topico_descritiva, 'dificil', 'multipla_escolha', 0);

SET @qid4 = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid4, 'A distribuição é perfeitamente simétrica, pois Q2-Q1 = Q3-Q2 = 10.', 0, 1),
(@qid4, 'A distribuição é assimétrica à esquerda (negativa), pois a cauda inferior (Q1-Min=30) é muito maior que a cauda superior (Max-Q3=5), indicando valores extremos baixos.', 1, 2),
(@qid4, 'A distribuição é assimétrica à direita (positiva), pois o valor máximo (60) é maior que o mínimo (5).', 0, 3),
(@qid4, 'A distribuição é bimodal, devido à diferença entre as distâncias das caudas.', 0, 4),
(@qid4, 'Não é possível determinar a simetria apenas com o Resumo dos 5 Números.', 0, 5);


-- =================================================================================
-- Questão 5: Diagnóstico de Distribuição Simétrica
-- =================================================================================
-- Dados: Min=12, Q1=25, Q2=35, Q3=45, Max=58
-- Análise do miolo: Q2-Q1 = 35-25 = 10, Q3-Q2 = 45-35 = 10 → SIMÉTRICO
-- Análise das caudas: Q1-Min = 25-12 = 13, Max-Q3 = 58-45 = 13 → SIMÉTRICO
-- Conclusão: Distribuição SIMÉTRICA

INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Uma pesquisa sobre a idade de funcionários de uma empresa revelou o seguinte Resumo dos 5 Números: Mínimo=12, Q1=25, Mediana=35, Q3=45, Máximo=58. Utilizando as distâncias entre os quartis ($Q_2 - Q_1$ vs $Q_3 - Q_2$) e as distâncias dos extremos ($Q_1 - Min$ vs $Max - Q_3$), qual é o diagnóstico correto sobre a simetria desta distribuição?', 
@topico_descritiva, 'dificil', 'multipla_escolha', 0);

SET @qid5 = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid5, 'A distribuição é assimétrica à direita, pois o valor máximo (58) está mais distante da mediana que o mínimo (12).', 0, 1),
(@qid5, 'A distribuição é assimétrica à esquerda, pois Q1 (25) está mais próximo de Q2 (35) do que Q3 (45).', 0, 2),
(@qid5, 'A distribuição é leptocúrtica, dado que o IQR (20) é menor que a amplitude total (46).', 0, 3),
(@qid5, 'A distribuição apresenta outliers nos dois extremos, impossibilitando o diagnóstico de simetria.', 0, 4),
(@qid5, 'A distribuição é aproximadamente simétrica, pois tanto as distâncias do miolo (Q2-Q1=10, Q3-Q2=10) quanto as distâncias das caudas (Q1-Min=13, Max-Q3=13) são iguais.', 1, 5);


SELECT 'Questões extras de Simetria (nível difícil) inseridas com sucesso!' AS status;
