-- Adicionar questão 12 sobre Mortes por Coices de Cavalos (Poisson)
-- Execute este script no MySQL Workbench

USE banco_questoes_estatistica;

-- Obter o ID do tópico Poisson
SET @topico_poisson = (SELECT id FROM topicos WHERE nome = 'Distribuição de Probabilidade (Poisson)' LIMIT 1);

-- Inserir a questão
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Um exemplo clássico da distribuição de Poisson envolve o número de mortes por coices de cavalos entre 1875 e 1894 em 14 unidades do exército prussiano. Dados para 14 unidades-ano: 144 unidades-ano com 0 mortes, 91 com 1 morte, 32 com 2 mortes, 11 com 3 mortes, 2 com 4 mortes. Compare os resultados reais com os esperados pela probabilidade de uma unidade-ano selecionada aleatoriamente ter exatamente k mortes. A distribuição de Poisson modela adequadamente este fenômeno?', 
@topico_poisson, 'medio', 'multipla_escolha', 0);

SET @questao_id = LAST_INSERT_ID();

-- Inserir alternativas
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@questao_id, 'Não, pois a média calculada (λ = 0.7) é muito baixa para aplicar a distribuição de Poisson', 0, 1),
(@questao_id, 'Sim, os resultados reais são muito próximos dos esperados pela Poisson (0 mortes: esperado 139 vs real 144; 1 morte: esperado 97 vs real 91)', 1, 2),
(@questao_id, 'Não, pois a variância observada é significativamente diferente da média, violando a premissa da Poisson', 0, 3),
(@questao_id, 'Sim, mas apenas para k ≥ 2, pois para k < 2 há grande discrepância entre valores esperados e observados', 0, 4),
(@questao_id, 'Não, pois eventos de mortes por coices de cavalos não são independentes entre unidades militares', 0, 5);

-- Verificar inserção
SELECT 'Questão 12 adicionada com sucesso!' as resultado;
SELECT q.id, q.enunciado, t.nome as topico 
FROM questoes q 
JOIN topicos t ON q.topico_id = t.id 
WHERE q.id = @questao_id;
