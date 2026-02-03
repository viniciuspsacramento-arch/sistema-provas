USE banco_questoes_estatistica;

SET @topico_descritiva = (SELECT id FROM topicos WHERE nome = 'Estatística descritiva (exploração e comparação de dados)' LIMIT 1);

-- =================================================================================
-- Questão: Histograma - Diferença entre Assimetria e Curtose (Nível Médio)
-- =================================================================================

INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem, enunciado_imagem) VALUES
('Observe as descrições de dois histogramas:

**Histograma A:** Possui formato de sino, com a maior concentração de dados no centro e caudas simétricas dos dois lados.

**Histograma B:** Também possui formato de sino simétrico, porém com um pico central muito mais alto e estreito, e caudas mais longas que se estendem bastante.

Qual é a diferença CORRETA entre essas duas distribuições?', 
@topico_descritiva, 'medio', 'multipla_escolha', 1, '/uploads/histograma_curtose_final.png');

SET @qid_comp = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid_comp, 'A diferença está na CURTOSE: ambas são simétricas, mas B é leptocúrtica (pico alto, caudas pesadas) enquanto A é mesocúrtica.', 1, 1),
(@qid_comp, 'A diferença está na ASSIMETRIA: A é simétrica e B é assimétrica à direita.', 0, 2),
(@qid_comp, 'A diferença está na MÉDIA: B tem média maior que A devido ao pico mais alto.', 0, 3),
(@qid_comp, 'A diferença está na VARIÂNCIA: B tem menor variância por ter pico mais concentrado.', 0, 4),
(@qid_comp, 'Não há diferença estatística relevante, apenas visual.', 0, 5);


-- =================================================================================
-- Questão 2: Identificando Assimetria vs Curtose em Histogramas (Nível Médio)
-- =================================================================================

INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem, enunciado_imagem) VALUES
('Considere os três histogramas abaixo (X, Y e Z) que representam diferentes distribuições de dados:

**Histograma X:** Pico à esquerda e cauda longa à direita.
**Histograma Y:** Distribuição simétrica em forma de sino padrão.
**Histograma Z:** Distribuição simétrica com pico acentuado e caudas longas.

Analise visualmente as características e assinale a alternativa que classifica CORRETAMENTE cada distribuição quanto à assimetria e curtose:', 
@topico_descritiva, 'medio', 'multipla_escolha', 1, '/uploads/histogramas_xyz.png');

SET @qid_comp2 = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid_comp2, 'X: Assimétrico à esquerda; Y: Leptocúrtico; Z: Platicúrtico.', 0, 1),
(@qid_comp2, 'X: Leptocúrtico; Y: Mesocúrtico; Z: Assimétrico à direita.', 0, 2),
(@qid_comp2, 'X: Assimétrico à direita; Y: Mesocúrtico/Platicúrtico; Z: Leptocúrtico.', 1, 3),
(@qid_comp2, 'X: Platicúrtico; Y: Assimétrico; Z: Mesocúrtico.', 0, 4),
(@qid_comp2, 'X: Simétrico; Y: Leptocúrtico; Z: Assimétrico à esquerda.', 0, 5);


SELECT 'Questões de Assimetria vs Curtose inseridas com sucesso!' AS status;
