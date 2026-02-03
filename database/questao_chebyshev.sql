USE banco_questoes_estatistica;

SET @topico_descritiva = (SELECT id FROM topicos WHERE nome = 'Estatística descritiva (exploração e comparação de dados)' LIMIT 1);

-- Inserir questão sobre Teorema de Chebyshev
INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo) VALUES
('**Teorema de Chebyshev**\n> A proporção (ou fração) de qualquer conjunto de dados que se situa a até K desvios-padrão da média é sempre, no mínimo, $1 - 1/K^2$, onde K é qualquer número positivo maior do que 1.\n> * Para K = 2: Pelo menos 3/4 (ou 75%) de todos os valores se localizam a até 2 desvios-padrão da média.\n> * Para K = 3: Pelo menos 8/9 (ou 89%) de todos os valores se localizam a até 3 desvios-padrão da média.\n\n**Aplicação:**\nOs escores de QI têm uma média de 100 e um desvio-padrão de 15. Com base no Teorema de Chebyshev, o que podemos concluir sobre a distribuição desses escores?', 
@topico_descritiva, 'medio', 'multipla_escolha');

-- Usar LAST_INSERT_ID() diretamente na query de inserção (funciona se for executado na mesma sessão, mas nosso runner separa. Melhor pegar pelo enunciado ou ordenar por ID).
-- Vou alterar para usar um subselect seguro baseado no enunciado que acabamos de inserir.

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Pelo menos 75% dos escores de QI estão entre 70 e 130.', 1, 1 FROM questoes WHERE enunciado LIKE '%Teorema de Chebyshev%' ORDER BY id DESC LIMIT 1;

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Aproximadamente 95% dos escores de QI estão entre 70 e 130.', 0, 2 FROM questoes WHERE enunciado LIKE '%Teorema de Chebyshev%' ORDER BY id DESC LIMIT 1;

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Exatamente 75% dos escores de QI estão entre 85 e 115.', 0, 3 FROM questoes WHERE enunciado LIKE '%Teorema de Chebyshev%' ORDER BY id DESC LIMIT 1;

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Pelo menos 89% dos escores de QI estão entre 70 e 130.', 0, 4 FROM questoes WHERE enunciado LIKE '%Teorema de Chebyshev%' ORDER BY id DESC LIMIT 1;

INSERT INTO alternativas (questao_id, texto, correta, ordem)
SELECT id, 'Nada podemos concluir, pois não sabemos se a distribuição é normal.', 0, 5 FROM questoes WHERE enunciado LIKE '%Teorema de Chebyshev%' ORDER BY id DESC LIMIT 1;

SELECT 'Questão Teorema de Chebyshev inserida com sucesso (fix)!' AS status;
