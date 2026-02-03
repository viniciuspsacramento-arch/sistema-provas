USE banco_questoes_estatistica;

-- 1. Criar o tópico se não existir
INSERT IGNORE INTO topicos (nome, descricao) VALUES 
('Distribuição de probabilidade (exponencial)', 'Questões sobre distribuição exponencial, propriedade de falta de memória e relação com Poisson.');

SET @topico_exp = (SELECT id FROM topicos WHERE nome = 'Distribuição de probabilidade (exponencial)' LIMIT 1);

-- =================================================================================
-- Questão: Distribuição Exponencial e Processo de Poisson (Nível Difícil)
-- =================================================================================

INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem, enunciado_imagem) VALUES
('As requisições chegam a um servidor de banco de dados segundo um Processo de Poisson com taxa média de λ = 5 requisições por minuto.

A variável aleatória T, que representa o tempo decorrido entre duas requisições consecutivas, segue uma distribuição Exponencial com parâmetro λ.

Com base no gráfico e nas propriedades da distribuição, determine a probabilidade de que o intervalo de tempo entre duas requisições consecutivas seja **MENOR que 12 segundos**.', 
@topico_exp, 'dificil', 'multipla_escolha', 1, '/uploads/grafico_exponencial.png');

SET @qid_exp = LAST_INSERT_ID();

-- Cálculo: 
-- 12 segundos = 0.2 minutos.
-- P(T < 0.2) = 1 - e^(-5 * 0.2) = 1 - e^(-1) ≈ 1 - 0.368 = 0.632

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid_exp, 'Aproximadamente 63,2% (P = 1 - 1/e).', 1, 1),
(@qid_exp, 'Aproximadamente 36,8% (P = 1/e).', 0, 2),
(@qid_exp, 'Aproximadamente 99,7% (P = 1 - e^-60).', 0, 3),
(@qid_exp, 'Aproximadamente 13,5% (P = 1/e^2).', 0, 4),
(@qid_exp, 'Aproximadamente 50,0% (coincide com a mediana).', 0, 5);

SELECT 'Questão de Exponencial (Difícil) inserida com sucesso!' AS status;
