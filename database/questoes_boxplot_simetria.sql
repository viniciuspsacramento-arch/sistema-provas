USE banco_questoes_estatistica;

SET @topico_descritiva = (SELECT id FROM topicos WHERE nome = 'Estatística descritiva (exploração e comparação de dados)' LIMIT 1);

-- =================================================================================
-- Questão 1: Assimetria Positiva e Relação Média/Mediana (Com Imagem)
-- =================================================================================
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem, enunciado_imagem) VALUES
('Analise o Box Plot abaixo, que representa a distribuição de salários em uma startup de tecnologia. Com base na forma da distribuição (posição da mediana e comprimento dos "whiskers"), qual das seguintes afirmações é estatisticamente CORRETA sobre a relação entre a média e a mediana desta amostra?', 
@topico_descritiva, 'dificil', 'multipla_escolha', 1, '/uploads/boxplot_skew.png');

SET @qid1 = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid1, 'A distribuição é assimetria positiva (à direita), logo espera-se que a Média > Mediana.', 1, 1),
(@qid1, 'A distribuição é assimetria negativa (à esquerda), logo espera-se que a Média < Mediana.', 0, 2),
(@qid1, 'A distribuição é simétrica, logo a Média ≈ Mediana.', 0, 3),
(@qid1, 'A mediana está deslocada para a esquerda, indicando que a moda é maior que a média.', 0, 4),
(@qid1, 'O comprimento do whisker direito indica alta concentração de dados baixos, logo Média = Moda.', 0, 5);


-- =================================================================================
-- Questão 2: Comparação de Variabilidade e Simetria (Com Imagem)
-- =================================================================================
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem, enunciado_imagem) VALUES
('Considere os Box Plots das Máquinas A e B abaixo, que representam o tempo de operação até a falha. Ambas possuem medianas similares. Qual das seguintes análises comparativas é a mais adequada?', 
@topico_descritiva, 'dificil', 'multipla_escolha', 1, '/uploads/boxplot_compare.png');

SET @qid2 = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid2, 'A Máquina A apresenta distribuição simétrica mas com maior variabilidade (maior IQR) que a Máquina B (que é assimétrica à direita).', 1, 1),
(@qid2, 'A Máquina B é mais consistente (menor variabilidade) e possui distribuição perfeitamente simétrica.', 0, 2),
(@qid2, 'A Máquina A é assimétrica à esquerda, enquanto a Máquina B é simétrica.', 0, 3),
(@qid2, 'A Máquina B, apesar de ter menor amplitude total, apresenta maior Desvio Padrão devido à assimetria.', 0, 4),
(@qid2, 'Não é possível comparar a variabilidade (IQR) apenas visualizando os Box Plots.', 0, 5);


-- =================================================================================
-- Questão 3: Diagnóstico Numérico de Assimetria (Sem Imagem)
-- =================================================================================
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Em um conjunto de dados, o "Resumo dos 5 Números" é: Mínimo=10, Q1=30, Mediana=40, Q3=50, Máximo=120. Utilize as distâncias entre os quartis ($Q_2 - Q_1$ vs $Q_3 - Q_2$) e as distâncias dos extremos ($Q_1 - Min$ vs $Max - Q_3$) para diagnosticar a simetria da distribuição. Qual a conclusão correta?', 
@topico_descritiva, 'dificil', 'multipla_escolha', 0);

SET @qid3 = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid3, 'A distribuição é fortemente assimétrica à direita (positiva), pois a distância do bigode superior (120-50=70) é muito maior que a do inferior (30-10=20).', 1, 1),
(@qid3, 'A distribuição é simétrica, pois a distância Q2-Q1 (10) é igual à distância Q3-Q2 (10).', 0, 2), -- Distrator forte: o miolo é simétrico, mas as caudas não.
(@qid3, 'A distribuição é assimétrica à esquerda, pois a mediana está mais próxima de Q3.', 0, 3),
(@qid3, 'A distribuição é bimodal, dado o grande intervalo total.', 0, 4),
(@qid3, 'Não há evidência de assimetria, pois a mediana é exatamente a média de Q1 e Q3.', 0, 5);

SELECT 'Questões de Box Plot (nível difícil) inseridas com sucesso!' AS status;
