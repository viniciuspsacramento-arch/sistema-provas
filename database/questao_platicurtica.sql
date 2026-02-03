USE banco_questoes_estatistica;

SET @topico_descritiva = (SELECT id FROM topicos WHERE nome = 'Estatística descritiva (exploração e comparação de dados)' LIMIT 1);

-- =================================================================================
-- Questão 3: Comparação Platicúrtica vs Normal (Análoga à Questão 1)
-- =================================================================================

INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem, enunciado_imagem) VALUES
('Observe as descrições de dois histogramas:

**Histograma C:** Apresenta um formato mais achatado, com os dados distribuídos mais uniformemente ao redor da média e caudas muito curtas e leves.

**Histograma D:** Apresenta o formato clássico de sino, com concentração moderada no centro e caudas simétricas que decaem suavemente.

Qual é a diferença CORRETA entre essas duas distribuições?', 
@topico_descritiva, 'medio', 'multipla_escolha', 1, '/uploads/histograma_platicurtica_vs_normal.png');

SET @qid_plati = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid_plati, 'A diferença está na CURTOSE: C é Platicúrtica (mais achatada) e D é Mesocúrtica (Normal).', 1, 1),
(@qid_plati, 'A diferença está na ASSIMETRIA: C é assimétrica positiva e D é simétrica.', 0, 2),
(@qid_plati, 'A diferença está na TENDÊNCIA CENTRAL: C não possui média definida, enquanto D possui.', 0, 3),
(@qid_plati, 'A diferença está na DISPERSÃO: D tem variância zero, enquanto C tem variância alta.', 0, 4),
(@qid_plati, 'Não há diferença significativa, ambas representam a mesma distribuição Normal.', 0, 5);

SELECT 'Questão Platicúrtica inserida com sucesso!' AS status;
