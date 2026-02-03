USE banco_questoes_estatistica;

-- Adicionar o novo tópico solicitado
INSERT INTO topicos (nome, descricao)
SELECT 'Estatística descritiva (exploração e comparação de dados)', 'Conceitos fundamentais de resumo, organização e interpretação de dados.'
WHERE NOT EXISTS (
    SELECT 1 FROM topicos WHERE nome = 'Estatística descritiva (exploração e comparação de dados)'
);

-- Confirmar a inserção
SELECT id, nome, descricao, criado_em 
FROM topicos 
WHERE nome = 'Estatística descritiva (exploração e comparação de dados)';
