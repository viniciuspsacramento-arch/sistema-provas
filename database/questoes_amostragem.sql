-- Script para adicionar questões de Teoria de Amostragem
-- Execute este script no MySQL Workbench

USE banco_questoes_estatistica;

-- Primeiro, adicionar o tópico Amostragem (se ainda não existir)
INSERT IGNORE INTO topicos (nome, descricao) 
VALUES ('Amostragem', 'Teoria de Amostragem e técnicas de seleção amostral');

-- Obter o ID do tópico Amostragem
SET @topico_amostragem = (SELECT id FROM topicos WHERE nome = 'Amostragem' LIMIT 1);

-- Questão 1
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Considere um plano amostral no qual cada unidade da população possui probabilidade positiva e conhecida de inclusão, mas as seleções não são independentes. Esse plano é corretamente classificado como:', 
@topico_amostragem, 'medio', 'multipla_escolha', 0);

SET @q1 = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@q1, 'Não probabilístico', 0, 1),
(@q1, 'Probabilístico', 1, 2),
(@q1, 'Sistemático inválido', 0, 3),
(@q1, 'Estratificado incorreto', 0, 4),
(@q1, 'Amostragem por conveniência', 0, 5);

-- Questão 2
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Na amostragem sistemática com início aleatório, é correto afirmar que:', 
@topico_amostragem, 'medio', 'multipla_escolha', 0);

SET @q2 = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@q2, 'A amostra é equivalente à aleatória simples para qualquer ordenação', 0, 1),
(@q2, 'As probabilidades conjuntas de inclusão são sempre iguais', 0, 2),
(@q2, 'Cada unidade possui a mesma probabilidade marginal de seleção', 1, 3),
(@q2, 'Não existe correlação entre unidades selecionadas', 0, 4),
(@q2, 'O valor de k não influencia o plano', 0, 5);

-- Questão 3
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Uma população está ordenada de forma crescente segundo a variável de interesse. Nessa situação, a amostragem sistemática tende a:', 
@topico_amostragem, 'medio', 'multipla_escolha', 0);

SET @q3 = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@q3, 'Eliminar o viés', 0, 1),
(@q3, 'Produzir estimativas não viesadas', 0, 2),
(@q3, 'Produzir estimativas com viés potencial', 1, 3),
(@q3, 'Tornar-se equivalente à estratificada', 0, 4),
(@q3, 'Ser superior à aleatória simples', 0, 5);

-- Questão 4
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Um pesquisador divide a população em regiões geográficas, sorteia algumas regiões e, dentro delas, entrevista apenas indivíduos disponíveis no momento da visita. Esse plano amostral é corretamente descrito como:', 
@topico_amostragem, 'medio', 'multipla_escolha', 0);

SET @q4 = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@q4, 'Probabilístico em todas as etapas', 0, 1),
(@q4, 'Não probabilístico', 0, 2),
(@q4, 'Probabilístico no primeiro estágio e não probabilístico no segundo', 1, 3),
(@q4, 'Estratificado não proporcional', 0, 4),
(@q4, 'Amostragem por conglomerados probabilística', 0, 5);

-- Questão 5
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Na amostragem estratificada não proporcional, para obter uma estimativa não viesada da média populacional, o pesquisador deve:', 
@topico_amostragem, 'medio', 'multipla_escolha', 0);

SET @q5 = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@q5, 'Utilizar a média simples da amostra', 0, 1),
(@q5, 'Aumentar o tamanho amostral', 0, 2),
(@q5, 'Aplicar ponderações por estrato', 1, 3),
(@q5, 'Garantir estratos homogêneos', 0, 4),
(@q5, 'Eliminar estratos pequenos', 0, 5);

-- Questão 6
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('O principal ganho estatístico da amostragem estratificada, quando bem planejada, é:', 
@topico_amostragem, 'medio', 'multipla_escolha', 0);

SET @q6 = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@q6, 'Redução de custos operacionais', 0, 1),
(@q6, 'Eliminação do erro amostral', 0, 2),
(@q6, 'Aumento da precisão das estimativas', 1, 3),
(@q6, 'Independência total entre observações', 0, 4),
(@q6, 'Ausência de viés de seleção', 0, 5);

-- Questão 7
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Comparando amostragem por conglomerados com amostragem estratificada, é correto afirmar que a primeira tende a apresentar:', 
@topico_amostragem, 'medio', 'multipla_escolha', 0);

SET @q7 = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@q7, 'Menor variância, devido à homogeneidade interna', 0, 1),
(@q7, 'Maior variância, devido à correlação intra-conglomerado', 1, 2),
(@q7, 'Variância nula para médias', 0, 3),
(@q7, 'Independência entre unidades amostradas', 0, 4),
(@q7, 'Maior precisão, independentemente do desenho', 0, 5);

-- Questão 8
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Uma pesquisa utiliza como base amostral um cadastro desatualizado que exclui novos domicílios. O principal problema introduzido é:', 
@topico_amostragem, 'medio', 'multipla_escolha', 0);

SET @q8 = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@q8, 'Viés de não resposta', 0, 1),
(@q8, 'Viés de mensuração', 0, 2),
(@q8, 'Viés de cobertura', 1, 3),
(@q8, 'Viés aleatório', 0, 4),
(@q8, 'Erro de processamento', 0, 5);

-- Questão 9
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Em relação à amostragem por quotas, é correto afirmar que:', 
@topico_amostragem, 'medio', 'multipla_escolha', 0);

SET @q9 = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@q9, 'É probabilística se as quotas forem proporcionais', 0, 1),
(@q9, 'Permite inferência estatística clássica', 0, 2),
(@q9, 'Torna-se válida com grandes amostras', 0, 3),
(@q9, 'Não garante probabilidades conhecidas de inclusão', 1, 4),
(@q9, 'É equivalente à estratificada', 0, 5);

-- Questão 10
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Em um plano de amostragem sistemática válido, a dependência entre unidades selecionadas implica que:', 
@topico_amostragem, 'medio', 'multipla_escolha', 0);

SET @q10 = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@q10, 'O estimador da média é viesado', 0, 1),
(@q10, 'O plano deixa de ser probabilístico', 0, 2),
(@q10, 'A variância deve considerar o desenho amostral', 1, 3),
(@q10, 'A amostra não é representativa', 0, 4),
(@q10, 'O início aleatório perde importância', 0, 5);

-- Questão 11
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Considere a afirmação: "O aumento do tamanho da amostra corrige problemas de viés de seleção." Essa afirmação é:', 
@topico_amostragem, 'medio', 'multipla_escolha', 0);

SET @q11 = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@q11, 'Verdadeira, pela Lei dos Grandes Números', 0, 1),
(@q11, 'Verdadeira para amostragem probabilística', 0, 2),
(@q11, 'Falsa, pois viés não é corrigido por tamanho', 1, 3),
(@q11, 'Verdadeira para amostragem sistemática', 0, 4),
(@q11, 'Falsa apenas em amostragem não probabilística', 0, 5);

-- Questão 12
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Uma diferença conceitual fundamental entre estratos e conglomerados é que:', 
@topico_amostragem, 'medio', 'multipla_escolha', 0);

SET @q12 = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@q12, 'Apenas estratos utilizam sorteio', 0, 1),
(@q12, 'Estratos são internamente homogêneos', 1, 2),
(@q12, 'Conglomerados são internamente homogêneos', 0, 3),
(@q12, 'Apenas conglomerados são probabilísticos', 0, 4),
(@q12, 'Ambos têm a mesma finalidade', 0, 5);

-- Questão 13
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Uma amostragem é dita probabilística quando:', 
@topico_amostragem, 'medio', 'multipla_escolha', 0);

SET @q13 = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@q13, 'Todas as unidades têm a mesma chance de seleção', 0, 1),
(@q13, 'Existe sorteio em pelo menos uma etapa', 0, 2),
(@q13, 'As probabilidades de inclusão são conhecidas', 1, 3),
(@q13, 'O pesquisador não interfere no processo', 0, 4),
(@q13, 'A amostra é representativa', 0, 5);

-- Questão 14
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Em uma amostragem sistemática, a principal condição para reduzir o risco de viés é:', 
@topico_amostragem, 'medio', 'multipla_escolha', 0);

SET @q14 = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@q14, 'População pequena', 0, 1),
(@q14, 'Intervalo k grande', 0, 2),
(@q14, 'Ordenação aleatória da população', 1, 3),
(@q14, 'Amostra proporcional', 0, 4),
(@q14, 'Uso de ponderação', 0, 5);

-- Questão 15
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('A inferência estatística clássica baseada em erros padrão e intervalos de confiança é, em geral, apropriada quando a amostra é:', 
@topico_amostragem, 'medio', 'multipla_escolha', 0);

SET @q15 = LAST_INSERT_ID();
INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@q15, 'Grande, independentemente do método', 0, 1),
(@q15, 'Obtida por quotas', 0, 2),
(@q15, 'Probabilística, com probabilidades conhecidas', 1, 3),
(@q15, 'Sistemática sem início aleatório', 0, 4),
(@q15, 'Não probabilística com ponderação', 0, 5);

-- Verificar quantas questões foram inseridas
SELECT COUNT(*) as total_questoes_amostragem 
FROM questoes 
WHERE topico_id = @topico_amostragem;
