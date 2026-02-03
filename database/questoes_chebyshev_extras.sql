USE banco_questoes_estatistica;

SET @topico_descritiva = (SELECT id FROM topicos WHERE nome = 'Estatística descritiva (exploração e comparação de dados)' LIMIT 1);

-- =================================================================================
-- Variação 1: Vida Útil de Baterias (K=3)
-- Média = 500 dias, DP = 50 dias. Intervalo [350, 650] -> +/- 150 -> 3 sigmas.
-- =================================================================================
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('**Teorema de Chebyshev (Aplicação Industrial)**\n> O teorema garante que a fração de dados a K desvios-padrão da média é pelo menos $1 - 1/K^2$.\n\nUma fábrica de baterias determina que a vida útil média de seus produtos é de 500 dias, com um desvio-padrão de 50 dias. Não se sabe se a distribuição é normal. Utilizando o Teorema de Chebyshev, qual a porcentagem mínima de baterias que terão vida útil entre 350 e 650 dias?', 
@topico_descritiva, 'dificil', 'multipla_escolha');

-- Alternativas para Variação 1
INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Pelo menos 88,9% (ou 8/9).', 1, 1 FROM questoes WHERE enunciado LIKE '%baterias que terão vida útil entre 350 e 650 dias%' ORDER BY id DESC LIMIT 1;

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Pelo menos 75% (ou 3/4).', 0, 2 FROM questoes WHERE enunciado LIKE '%baterias que terão vida útil entre 350 e 650 dias%' ORDER BY id DESC LIMIT 1;

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Aproximadamente 99,7%.', 0, 3 FROM questoes WHERE enunciado LIKE '%baterias que terão vida útil entre 350 e 650 dias%' ORDER BY id DESC LIMIT 1; -- Regra empírica (3 sigmas)

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Exatamente 89%.', 0, 4 FROM questoes WHERE enunciado LIKE '%baterias que terão vida útil entre 350 e 650 dias%' ORDER BY id DESC LIMIT 1;

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Pelo menos 95%.', 0, 5 FROM questoes WHERE enunciado LIKE '%baterias que terão vida útil entre 350 e 650 dias%' ORDER BY id DESC LIMIT 1;

-- =================================================================================
-- Variação 2: Preços de Componentes (K=2)
-- Média = R$ 120,00, DP = R$ 10,00. Intervalo [100, 140] -> +/- 20 -> 2 sigmas.
-- =================================================================================
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('**Teorema de Chebyshev (Análise de Custos)**\n> Lembre-se: Para K=2, o teorema garante pelo menos 75% dos dados dentro do intervalo.\n\nUm analista financeiro observa que o preço médio de um determinado componente eletrônico é R$ 120,00, com desvio-padrão de R$ 10,00. Se nada for assumido sobre a forma da distribuição dos preços, o que podemos afirmar sobre o intervalo de preços entre R$ 100,00 e R$ 140,00?', 
@topico_descritiva, 'medio', 'multipla_escolha');

-- Alternativas para Variação 2
INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Este intervalo contém pelo menos 75% dos preços praticados.', 1, 1 FROM questoes WHERE enunciado LIKE '%intervalo de preços entre R$ 100,00 e R$ 140,00%' ORDER BY id DESC LIMIT 1;

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Este intervalo contém aproximadamente 95% dos preços praticados.', 0, 2 FROM questoes WHERE enunciado LIKE '%intervalo de preços entre R$ 100,00 e R$ 140,00%' ORDER BY id DESC LIMIT 1; -- Regra empírica

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Este intervalo contém no máximo 25% dos preços praticados.', 0, 3 FROM questoes WHERE enunciado LIKE '%intervalo de preços entre R$ 100,00 e R$ 140,00%' ORDER BY id DESC LIMIT 1;

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Este intervalo contém pelo menos 89% dos preços praticados.', 0, 4 FROM questoes WHERE enunciado LIKE '%intervalo de preços entre R$ 100,00 e R$ 140,00%' ORDER BY id DESC LIMIT 1;

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Não é possível afirmar nada sem saber se a distribuição é normal.', 0, 5 FROM questoes WHERE enunciado LIKE '%intervalo de preços entre R$ 100,00 e R$ 140,00%' ORDER BY id DESC LIMIT 1;

SELECT 'Duas variações de Chebyshev inseridas com sucesso!' AS status;
