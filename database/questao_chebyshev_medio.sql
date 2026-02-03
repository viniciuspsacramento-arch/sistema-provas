USE banco_questoes_estatistica;

SET @topico_descritiva = (SELECT id FROM topicos WHERE nome = 'Estatística descritiva (exploração e comparação de dados)' LIMIT 1);

-- =================================================================================
-- Questão Extra: Tempo de Espera (K=2 Inverso)
-- Média = 180s, DP = 20s. Queremos saber o intervalo para 75% (K=2).
-- =================================================================================
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('**Teorema de Chebyshev (Tempo de Espera)**\n\nUm gerente de call center sabe que o tempo médio de espera dos clientes é de 180 segundos, com um desvio-padrão de 20 segundos. No entanto, ele sabe que a distribuição dos tempos **não** é normal (é fortemente assimétrica à direita). Utilizando o Teorema de Chebyshev, determine o intervalo de tempo no qual podemos garantir que **pelo menos 75%** dos clientes são atendidos.', 
@topico_descritiva, 'medio', 'multipla_escolha');

-- Alternativas
INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Entre 140 e 220 segundos.', 1, 1 FROM questoes WHERE enunciado LIKE '%gerente de call center%' ORDER BY id DESC LIMIT 1;

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Entre 160 e 200 segundos.', 0, 2 FROM questoes WHERE enunciado LIKE '%gerente de call center%' ORDER BY id DESC LIMIT 1; -- 1 desvio padrão

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Entre 120 e 240 segundos.', 0, 3 FROM questoes WHERE enunciado LIKE '%gerente de call center%' ORDER BY id DESC LIMIT 1; -- 3 desvios padrão

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Entre 150 e 210 segundos.', 0, 4 FROM questoes WHERE enunciado LIKE '%gerente de call center%' ORDER BY id DESC LIMIT 1;

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Menos de 180 segundos.', 0, 5 FROM questoes WHERE enunciado LIKE '%gerente de call center%' ORDER BY id DESC LIMIT 1;

SELECT 'Questão Call Center (Chebyshev Médio) inserida com sucesso!' AS status;
