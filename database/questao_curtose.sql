USE banco_questoes_estatistica;

SET @topico_descritiva = (SELECT id FROM topicos WHERE nome = 'Estatística descritiva (exploração e comparação de dados)' LIMIT 1);

-- =================================================================================
-- Questão: Curtose - Coeficiente Percentílico (Nível Difícil)
-- =================================================================================
-- 
-- FÓRMULA UTILIZADA: Coeficiente de Curtose Percentílico (Moors)
-- 
--        (Q₃ - Q₂) + (Q₂ - Q₁)       IQR
-- K = ─────────────────────────── = ───────────
--        2 × (P₉₀ - P₁₀)           2 × ID
--
-- Onde:
--   IQR = Q₃ - Q₁ (Amplitude Interquartil)
--   ID = P₉₀ - P₁₀ (Amplitude Interdecil)
--
-- INTERPRETAÇÃO (para distribuição Normal, K ≈ 0.263):
--   K > 0.263 → Platicúrtica (achatada, caudas leves)
--   K ≈ 0.263 → Mesocúrtica (similar à normal)
--   K < 0.263 → Leptocúrtica (pico alto, caudas pesadas)
--
-- Obs: Valores MENORES de K indicam caudas mais pesadas (leptocúrtica)
--      porque o denominador (interdecil) é proporcionalmente maior
--
-- =================================================================================

INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Uma empresa analisou o tempo de atendimento (em minutos) em duas filiais usando o Coeficiente de Curtose Percentílico:

K = (Q₃ - Q₁) / [2 × (P₉₀ - P₁₀)]

Os resultados foram:

**Filial A:** Q₁ = 5 | Q₃ = 15 | P₁₀ = 2 | P₉₀ = 22
**Filial B:** Q₁ = 8 | Q₃ = 12 | P₁₀ = 1 | P₉₀ = 25

Sabendo que para a distribuição Normal K ≈ 0.263, classifique cada filial quanto à curtose e indique qual apresenta maior risco de tempos de atendimento extremamente longos.', 
@topico_descritiva, 'dificil', 'multipla_escolha', 0);

SET @qid_curtose = LAST_INSERT_ID();

-- Cálculos:
-- Filial A: K = (15-5) / (2 × (22-2)) = 10 / 40 = 0.25 ≈ 0.263 → MESOCÚRTICA
-- Filial B: K = (12-8) / (2 × (25-1)) = 4 / 48 = 0.083 < 0.263 → LEPTOCÚRTICA

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid_curtose, 'Filial A: Leptocúrtica, Filial B: Platicúrtica. A Filial A tem maior risco de extremos.', 0, 1),
(@qid_curtose, 'Ambas são mesocúrticas, pois possuem IQR similares. O risco de extremos é equivalente.', 0, 2),
(@qid_curtose, 'Filial A: Mesocúrtica (K=0.25≈0.263), Filial B: Leptocúrtica (K=0.083<0.263). A Filial B apresenta maior risco de tempos extremos, pois suas caudas são mais pesadas.', 1, 3),
(@qid_curtose, 'Filial A: Platicúrtica (K=0.25>0.263), Filial B: Mesocúrtica. A Filial A tem maior risco por ser mais achatada.', 0, 4),
(@qid_curtose, 'Filial B: Platicúrtica, pois K menor indica distribuição mais achatada. Filial B tem menor risco.', 0, 5);


-- =================================================================================
-- Questão 2: Interpretação Prática de Curtose (Contexto de Qualidade)
-- =================================================================================

INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES
('Em um processo de controle de qualidade, peças são medidas em milímetros. Foram coletados os percentis de duas máquinas:

**Máquina M1:**
• P₁₀ = 48 | Q₁ = 49 | Mediana = 50 | Q₃ = 51 | P₉₀ = 52

**Máquina M2:**
• P₁₀ = 44 | Q₁ = 49 | Mediana = 50 | Q₃ = 51 | P₉₀ = 56

Utilizando o Coeficiente de Curtose Percentílico:

K = IQR / [2 × (P₉₀ - P₁₀)]

Onde valores menores de K indicam caudas mais pesadas (leptocúrtica), qual máquina apresenta maior probabilidade de produzir peças fora das especificações?', 
@topico_descritiva, 'dificil', 'multipla_escolha', 0);

SET @qid_curtose2 = LAST_INSERT_ID();

-- Cálculos:
-- M1: IQR = 51-49 = 2, ID = 52-48 = 4, K = 2/(2×4) = 2/8 = 0.25 → MESOCÚRTICA
-- M2: IQR = 51-49 = 2, ID = 56-44 = 12, K = 2/(2×12) = 2/24 = 0.083 → LEPTOCÚRTICA

INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES
(@qid_curtose2, 'Máquina M1 (K≈0.25): é mais leptocúrtica por ter menor amplitude interdecil.', 0, 1),
(@qid_curtose2, 'Ambas têm igual probabilidade de extremos, pois possuem o mesmo IQR e mediana.', 0, 2),
(@qid_curtose2, 'Máquina M2 é platicúrtica (K pequeno = achatada), portanto produz menos extremos.', 0, 3),
(@qid_curtose2, 'Máquina M2 (K≈0.083, leptocúrtica): tem caudas mais pesadas e maior probabilidade de valores extremos, mesmo com o mesmo IQR que M1.', 1, 4),
(@qid_curtose2, 'Não é possível determinar sem conhecer a média e o desvio padrão.', 0, 5);


SELECT 'Questões de Curtose Percentílica (nível difícil) inseridas com sucesso!' AS status;
