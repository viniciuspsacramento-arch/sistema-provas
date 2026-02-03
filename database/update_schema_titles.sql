USE banco_questoes_estatistica;

-- Adicionar coluna titulo_publico na tabela provas
ALTER TABLE provas
ADD COLUMN titulo_publico VARCHAR(200) AFTER titulo;

-- Atualizar descrições para documentação
ALTER TABLE provas MODIFY COLUMN titulo_publico VARCHAR(200) COMMENT 'Título exibido para o aluno (se NULL, usa o título interno)';

SELECT 'Coluna titulo_publico adicionada com sucesso!' AS status;
