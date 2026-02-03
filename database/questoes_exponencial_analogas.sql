USE banco_questoes_estatistica;

SET @topico_exp = (SELECT id FROM topicos WHERE nome = 'Distribuição de probabilidade (exponencial)' LIMIT 1);

-- =================================================================================
-- Questão Análoga 1: Mensagens em Servidor (T > t)
-- Contexto: λ = 3 msg/min. Prob T > 40s.
-- P(T > 40s) = P(T > 2/3 min) = e^(-3 * 2/3) = e^-2 ≈ 0.1353
-- =================================================================================

INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem, enunciado_imagem) VALUES
('Em um sistema de chat corporativo, as mensagens chegam ao servidor seguindo um Processo de Poisson com uma taxa média de **λ = 3** mensagens por minuto.

Seja T a variável aleatória que descreve o tempo entre a chegada de duas mensagens consecutivas (distribuição Exponencial). Qual é a probabilidade de que o servidor fique **MAIS de 40 segundos** sem receber nenhuma nova mensagem?', 
@topico_exp, 'medio', 'multipla_escolha', 1, '/uploads/grafico_exponencial_chat.png');

SET @qid_exp1 = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid_exp1, 'Aproximadamente 13,5% (P = e⁻²).', 1, 1),
(@qid_exp1, 'Aproximadamente 86,5% (P = 1 - e⁻²).', 0, 2),
(@qid_exp1, 'Aproximadamente 36,8% (P = e⁻¹).', 0, 3),
(@qid_exp1, 'Aproximadamente 5,0% (P = e⁻³).', 0, 4),
(@qid_exp1, 'Aproximadamente 22,3% (P = e⁻¹.⁵).', 0, 5);


-- =================================================================================
-- Questão Análoga 2: Clientes em Loja (T < t)
-- Contexto: λ = 6 clientes/hora = 0.1/min. Prob T < 15 min.
-- P(T < 15) = 1 - e^(-0.1 * 15) = 1 - e^-1.5
-- e^-1.5 ≈ 0.2231. Prob ≈ 0.7769
-- =================================================================================

INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem, enunciado_imagem) VALUES
('Uma loja de departamentos monitorou a entrada de clientes e constatou que ela segue um Processo de Poisson com taxa média de **λ = 6** clientes por hora.

Considerando que o tempo entre chegadas segue uma distribuição Exponencial, qual é a probabilidade de que o intervalo de tempo entre a chegada de dois clientes consecutivos seja **MENOR que 15 minutos**?', 
@topico_exp, 'dificil', 'multipla_escolha', 1, '/uploads/grafico_exponencial_loja.png');

SET @qid_exp2 = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid_exp2, 'Aproximadamente 77,7% (Probabilidade acumulada alta).', 1, 1),
(@qid_exp2, 'Aproximadamente 22,3% (Probabilidade de cauda).', 0, 2),
(@qid_exp2, 'Aproximadamente 15,0% (Linear com o tempo).', 0, 3),
(@qid_exp2, 'Aproximadamente 90,0% (Quase certeza).', 0, 4),
(@qid_exp2, 'Aproximadamente 50,0% (Mediana da distribuição).', 0, 5);

SELECT 'Duas questões análogas de Exponencial inseridas com sucesso!' AS status;
