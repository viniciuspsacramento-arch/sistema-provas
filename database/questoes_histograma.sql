USE banco_questoes_estatistica;

SET @topico_descritiva = (SELECT id FROM topicos WHERE nome = 'Estatística descritiva (exploração e comparação de dados)' LIMIT 1);

-- =================================================================================
-- Questão: Histograma - Análise de Densidade e Frequência (Nível Difícil)
-- =================================================================================
-- Esta questão explora a diferença entre histograma de frequência e de densidade,
-- e como interpretar a área das barras em vez da altura.
-- =================================================================================

INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Um pesquisador construiu um histograma de DENSIDADE para representar a idade de 200 funcionários de uma empresa. O histograma possui as seguintes classes e alturas (densidade):

**Classe 1:** 20-30 anos → Densidade = 0.025
**Classe 2:** 30-40 anos → Densidade = 0.040
**Classe 3:** 40-50 anos → Densidade = 0.035
**Classe 4:** 50-70 anos → Densidade = 0.015

Sabendo que em um histograma de densidade a ÁREA de cada barra representa a proporção (frequência relativa), e não a altura, qual é o número aproximado de funcionários com idade entre 50 e 70 anos?', 
@topico_descritiva, 'dificil', 'multipla_escolha', 0);

SET @qid_hist1 = LAST_INSERT_ID();

-- Cálculo:
-- Classe 50-70: Largura = 20, Densidade = 0.015
-- Área = 20 × 0.015 = 0.30 (30% dos dados)
-- Quantidade = 200 × 0.30 = 60 funcionários

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid_hist1, '3 funcionários, pois a densidade 0.015 representa 1.5% dos dados.', 0, 1),
(@qid_hist1, '30 funcionários, pois a densidade 0.015 multiplicada por 200 resulta em 3, mas a classe é mais larga.', 0, 2),
(@qid_hist1, '15 funcionários, correspondendo diretamente à densidade de 0.015 × 1000.', 0, 3),
(@qid_hist1, '60 funcionários, pois a área da barra é 20 × 0.015 = 0.30 (30%), e 30% de 200 = 60.', 1, 4),
(@qid_hist1, '40 funcionários, pois é a média das outras classes.', 0, 5);


-- =================================================================================
-- Questão 2: Histograma - Comparação de Distribuições (Nível Difícil)
-- =================================================================================

INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Dois histogramas (A e B) representam o tempo de espera em filas de dois bancos diferentes, ambos com 1000 clientes. Observa-se que:

**Histograma A:** Forma de sino (simétrico), com pico central pronunciado e caudas curtas.
**Histograma B:** Assimétrico à direita, com pico à esquerda e cauda longa à direita.

Ambos têm a mesma mediana de 5 minutos. Com base nessas informações, qual afirmação é CORRETA?', 
@topico_descritiva, 'dificil', 'multipla_escolha', 0);

SET @qid_hist2 = LAST_INSERT_ID();

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid_hist2, 'O Banco B tem média maior que 5 minutos, pois a assimetria à direita puxa a média para valores maiores que a mediana.', 1, 1),
(@qid_hist2, 'Ambos os bancos têm a mesma média, já que possuem a mesma mediana.', 0, 2),
(@qid_hist2, 'O Banco A tem maior variabilidade, pois a forma de sino indica maior dispersão.', 0, 3),
(@qid_hist2, 'O Banco B tem média menor que 5 minutos, pois o pico está à esquerda.', 0, 4),
(@qid_hist2, 'O Banco A é leptocúrtico e o Banco B é platicúrtico, logo têm médias diferentes.', 0, 5);


-- =================================================================================
-- Questão 3: Histograma com Classes de Larguras Diferentes (Nível Difícil)
-- =================================================================================

INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Um histograma mostra a distribuição do salário mensal (em R$ mil) de 500 funcionários de uma empresa. As classes têm larguras DIFERENTES:

**Classe 1:** R$ 1-3 mil → Frequência = 150
**Classe 2:** R$ 3-5 mil → Frequência = 200
**Classe 3:** R$ 5-10 mil → Frequência = 100
**Classe 4:** R$ 10-20 mil → Frequência = 50

Um analista construiu o histograma usando a ALTURA das barras igual à frequência. Qual é o problema com essa representação e qual seria a altura correta para a Classe 4 em um histograma de densidade?', 
@topico_descritiva, 'dificil', 'multipla_escolha', 0);

SET @qid_hist3 = LAST_INSERT_ID();

-- Problema: Classes com larguras diferentes exigem usar DENSIDADE (freq/largura)
-- Classe 1: largura=2, densidade = 150/2 = 75
-- Classe 2: largura=2, densidade = 200/2 = 100
-- Classe 3: largura=5, densidade = 100/5 = 20
-- Classe 4: largura=10, densidade = 50/10 = 5

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid_hist3, 'Não há problema, pois a frequência absoluta é a representação correta em qualquer histograma.', 0, 1),
(@qid_hist3, 'O problema é que classes maiores parecem ter menos dados. A altura da Classe 4 deveria ser 500 (frequência × largura).', 0, 2),
(@qid_hist3, 'Usar altura = frequência distorce a visualização. A altura correta para a Classe 4 seria 5 (densidade = 50/10).', 1, 3),
(@qid_hist3, 'O histograma deveria usar frequência relativa. A altura da Classe 4 seria 10% (50/500).', 0, 4),
(@qid_hist3, 'Classes de tamanhos diferentes invalidam o histograma; é necessário usar apenas Box Plot.', 0, 5);


SELECT 'Questões de Histograma (nível difícil) inseridas com sucesso!' AS status;
