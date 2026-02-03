-- Adicionar questão 9 sobre Defeitos em Tecido (Poisson)
-- Execute este script no MySQL Workbench

USE banco_questoes_estatistica;

-- Obter o ID do tópico Poisson
SET @topico_poisson = (SELECT id FROM topicos WHERE nome = 'Distribuição de Probabilidade (Poisson)' LIMIT 1);

-- Inserir a questão
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Uma fábrica produz um tecido que apresenta em média 1,5 defeitos por metro quadrado. Assumindo que o número de defeitos segue uma distribuição de Poisson, qual é a probabilidade de que em um metro quadrado de tecido haja exatamente 2 defeitos?', 
@topico_poisson, 'medio', 'multipla_escolha', 0);

SET @questao_id = LAST_INSERT_ID();

-- Cálculo: P(X=2) = (e^(-1.5) × 1.5^2) / 2! = (0.2231 × 2.25) / 2 = 0.2510 ≈ 25.1%

-- Inserir alternativas
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@questao_id, '0.1494 ou aproximadamente 14.9%', 0, 1),
(@questao_id, '0.2510 ou aproximadamente 25.1%', 1, 2),
(@questao_id, '0.3347 ou aproximadamente 33.5%', 0, 3),
(@questao_id, '0.2231 ou aproximadamente 22.3%', 0, 4),
(@questao_id, '0.1255 ou aproximadamente 12.6%', 0, 5);

-- Verificar inserção
SELECT 'Questão 9 adicionada com sucesso!' as resultado;
SELECT q.id, q.enunciado, t.nome as topico 
FROM questoes q 
JOIN topicos t ON q.topico_id = t.id 
WHERE q.id = @questao_id;

-- Mostrar cálculo
SELECT 
    'Resolução:' as info,
    'λ = 1.5 defeitos/m²' as parametro,
    'P(X=2) = (e^(-1.5) × 1.5²) / 2!' as formula,
    'P(X=2) = (0.2231 × 2.25) / 2' as calculo,
    'P(X=2) = 0.2510 ou 25.1%' as resposta_correta;
