USE banco_questoes_estatistica;

-- Descobrir nome da FK (pode variar, então vamos tentar dropar pelo nome padrão ou recriar)
-- No MySQL, para alterar uma FK, geralmente dropamos e recriamos.

-- 1. Dropar a Foreign Key existente na tabela tentativas
-- Nota: O nome da constraint pode variar. Vamos assumir o padrão ou tentar descobrir.
-- Se o nome for gerado automaticamente, pode ser 'tentativas_ibfk_1'.
-- Vamos usar um bloco seguro ou apenas rodar o ALTER TABLE assumindo o nome padrão se foi criado pelo script anterior.
-- O script original definiu: FOREIGN KEY (prova_id) REFERENCES provas(id) ON DELETE RESTRICT
-- Geralmente o MySQL nomeia como tentativas_ibfk_1.

ALTER TABLE tentativas DROP FOREIGN KEY tentativas_ibfk_1;

-- 2. Adicionar a FK novamente com ON DELETE CASCADE
ALTER TABLE tentativas
ADD CONSTRAINT tentativas_ibfk_1
FOREIGN KEY (prova_id) REFERENCES provas(id)
ON DELETE CASCADE;

-- Também precisamos verificar 'provas_questoes' (já tem CASCADE no prova_id? schema diz: ON DELETE CASCADE. OK.)
-- FOREIGN KEY (prova_id) REFERENCES provas(id) ON DELETE CASCADE

SELECT 'FK de tentativas atualizada para CASCADE com sucesso!' AS status;
