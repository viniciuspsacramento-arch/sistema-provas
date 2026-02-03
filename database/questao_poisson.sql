-- Adicionar questão sobre aproximação de Poisson para Binomial
-- Execute este script no MySQL Workbench

USE banco_questoes_estatistica;

-- Verificar se o tópico "Distribuição de Probabilidade (Poisson)" existe, senão criar
INSERT INTO topicos (nome, descricao)
SELECT 'Distribuição de Probabilidade (Poisson)', 'Distribuição de Poisson e suas aplicações'
WHERE NOT EXISTS (
    SELECT 1 FROM topicos WHERE nome = 'Distribuição de Probabilidade (Poisson)'
);

-- Obter o ID do tópico
SET @topico_poisson = (SELECT id FROM topicos WHERE nome = 'Distribuição de Probabilidade (Poisson)' LIMIT 1);

-- Inserir a questão
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Para uma distribuição binomial com n=10 e p=0,5, a aplicação da aproximação de Poisson produz resultados considerados:', 
@topico_poisson, 'medio', 'multipla_escolha', 0);

SET @questao_id = LAST_INSERT_ID();

-- Inserir alternativas
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@questao_id, 'Aceitáveis, pois a média (μ = 5) é um número inteiro, o que facilita a convergência entre os modelos.', 0, 1),
(@questao_id, 'Aceitáveis, uma vez que a distribuição de Poisson é o limite natural da binomial para qualquer valor de n superior a 5.', 0, 2),
(@questao_id, 'Inaceitáveis, pois a condição de "evento raro" (p pequeno) não é satisfeita, resultando em uma variância na Poisson que é o dobro da variância real da Binomial.', 1, 3),
(@questao_id, 'Inaceitáveis, porque a distribuição de Poisson é contínua e a Binomial é discreta, impedindo qualquer comparação direta.', 0, 4),
(@questao_id, 'Superiores à aproximação pela Normal, dado que a Poisson lida melhor com amostras pequenas (n < 30).', 0, 5);

-- Verificar inserção
SELECT 'Questão adicionada com sucesso!' as resultado;
SELECT q.id, q.enunciado, t.nome as topico 
FROM questoes q 
JOIN topicos t ON q.topico_id = t.id 
WHERE q.id = @questao_id;
