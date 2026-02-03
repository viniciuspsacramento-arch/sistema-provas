USE banco_questoes_estatistica;

-- Obter ID do tópico de Estatística Descritiva
SET @topico_descritiva = (SELECT id FROM topicos WHERE nome = 'Estatística descritiva (exploração e comparação de dados)' LIMIT 1);

-- Se não encontrar o tópico, criar (fallback de segurança)
INSERT INTO topicos (nome, descricao) 
SELECT 'Estatística descritiva (exploração e comparação de dados)', 'Conceitos fundamentais de resumo, organização e interpretação de dados.'
WHERE @topico_descritiva IS NULL;

-- Atualizar variável caso tenha sido criado agora
SET @topico_descritiva = (SELECT id FROM topicos WHERE nome = 'Estatística descritiva (exploração e comparação de dados)' LIMIT 1);

-- Inserir a questão
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('Informalmente, definimos valores *usuais* em um conjunto de dados como aqueles que são típicos e não muito extremos. Se o desvio-padrão de uma coleção de dados é conhecido, use-o para encontrar estimativas razoáveis dos limites para valores amostrais usuais como segue:\n\nValor mínimo "usual" = (média) - 2 × (desvio-padrão)\nValor máximo "usual" = (média) + 2 × (desvio-padrão)\n\nO Instituto de Seguros para Segurança nas Estradas realizou testes de colisão de carros novos a 6 mi/h. Os custos totais dos danos para cada carro de uma amostra aleatória simples testada estão listados a seguir: $7.448; $4.991; $9.051; $6.374; $4.277.\n\nCom base nesses dados e no critério acima, um dano de $10.000 seria considerado não usual?', 
@topico_descritiva, 'medio', 'multipla_escolha');

SET @qid = LAST_INSERT_ID();

-- Inserir as alternativas
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid, 'Não, pois $10.000 está dentro do intervalo de valores usuais (aprox. $2.605 a $10.251).', 1, 1),
(@qid, 'Sim, pois $10.000 é maior que a média somada a 1 desvio-padrão.', 0, 2),
(@qid, 'Sim, pois o valor máximo observado na amostra é $9.051, logo $10.000 é atípico.', 0, 3),
(@qid, 'Não, pois a mediana ($6.374) é próxima o suficiente de $10.000.', 0, 4),
(@qid, 'Sim, pois a média da amostra é $6.428, e $10.000 está muito distante disso.', 0, 5);

SELECT 'Questão sobre Danos de Colisão adicionada com sucesso!' AS status;
