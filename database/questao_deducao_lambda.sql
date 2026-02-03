-- Adicionar questão sobre dedução da média λ a partir de probabilidades de Poisson
-- Execute este script no MySQL Workbench

USE banco_questoes_estatistica;

-- Obter o ID do tópico Poisson
SET @topico_poisson = (SELECT id FROM topicos WHERE nome = 'Distribuição de Probabilidade (Poisson)' LIMIT 1);

-- Inserir a questão
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Um servidor web está sendo monitorado e observa-se que o número de solicitações por segundo segue uma distribuição de Poisson. Após análise, foram calculadas as seguintes probabilidades: P(X=0) = 0,0045; P(X=1) = 0,0244; P(X=2) = 0,0659. Com base nessas informações, qual é o valor aproximado da taxa média (λ) de solicitações por segundo que este servidor recebe?', 
@topico_poisson, 'dificil', 'multipla_escolha', 0);

SET @questao_id = LAST_INSERT_ID();

-- Resolução:
-- P(X=0) = e^(-λ) = 0.0045
-- ln(0.0045) = -λ
-- λ = -ln(0.0045) = 5.4
-- 
-- Verificação: P(X=1) = λ × e^(-λ) = 5.4 × 0.0045 = 0.0243 ✓
-- Verificação: P(X=2) = (λ² × e^(-λ))/2 = (29.16 × 0.0045)/2 = 0.0656 ✓

-- Inserir alternativas
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@questao_id, 'λ = 3.2 solicitações/segundo', 0, 1),
(@questao_id, 'λ = 4.1 solicitações/segundo', 0, 2),
(@questao_id, 'λ = 5.4 solicitações/segundo', 1, 3),
(@questao_id, 'λ = 6.8 solicitações/segundo', 0, 4),
(@questao_id, 'λ = 7.5 solicitações/segundo', 0, 5);

-- Verificar inserção
SELECT 'Questão sobre dedução de λ adicionada com sucesso!' as resultado;
SELECT q.id, q.enunciado, t.nome as topico 
FROM questoes q 
JOIN topicos t ON q.topico_id = t.id 
WHERE q.id = @questao_id;

-- Mostrar resolução
SELECT 
    'Resolução:' as info,
    'P(X=0) = e^(-λ) = 0.0045' as passo1,
    'ln(0.0045) = -λ' as passo2,
    'λ = -ln(0.0045) ≈ 5.4' as passo3,
    'Verificação: P(X=1) = 5.4 × 0.0045 ≈ 0.0244 ✓' as verificacao;
