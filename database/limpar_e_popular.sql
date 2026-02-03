-- Script para limpar dados duplicados e popular corretamente
-- Execute este script no MySQL Workbench

USE banco_questoes_estatistica;

-- Limpar todos os dados (em ordem devido às chaves estrangeiras)
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE respostas;
TRUNCATE TABLE tentativas;
TRUNCATE TABLE provas_questoes;
TRUNCATE TABLE provas;
TRUNCATE TABLE questoes_tags;
TRUNCATE TABLE alternativas;
TRUNCATE TABLE questoes;
TRUNCATE TABLE tags;
TRUNCATE TABLE topicos;

SET FOREIGN_KEY_CHECKS = 1;

-- Agora vamos popular com dados limpos
-- (O conteúdo do seed.sql original será inserido aqui)
