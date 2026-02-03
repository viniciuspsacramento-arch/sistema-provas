const mysql = require('mysql2/promise');

const CLOUD_DB_URL = 'mysql://root:DnfWVyYtTnGNnbwKlKbqegCOZeTvSlin@gondola.proxy.rlwy.net:25921/railway';

async function run() {
    console.log('--- Inserting Curtose Questions (JS) ---');
    const connection = await mysql.createConnection({
        uri: CLOUD_DB_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        // TOPIC ID 20: Estatística descritiva (exploração e comparação de dados)
        const topicoId = 20;

        // Verify Topic Exists
        const [tRows] = await connection.query('SELECT id, nome FROM topicos WHERE id = ?', [topicoId]);
        if (tRows.length === 0) {
            console.error(`❌ ERRO: Tópico ID ${topicoId} não encontrado! Listando todos:`);
            const [allT] = await connection.query('SELECT id, nome FROM topicos');
            allT.forEach(t => console.log(`${t.id}: ${t.nome}`));
            return;
        }
        console.log(`✅ Tópico encontrado: ${tRows[0].nome}`);

        // --- QUESTION 1 ---
        const enunciado1 = `Uma empresa analisou o tempo de atendimento (em minutos) em duas filiais usando o Coeficiente de Curtose Percentílico:

K = (Q₃ - Q₁) / [2 × (P₉₀ - P₁₀)]

Os resultados foram:

**Filial A:** Q₁ = 5 | Q₃ = 15 | P₁₀ = 2 | P₉₀ = 22
**Filial B:** Q₁ = 8 | Q₃ = 12 | P₁₀ = 1 | P₉₀ = 25

Sabendo que para a distribuição Normal K ≈ 0.263, classifique cada filial quanto à curtose e indique qual apresenta maior risco de tempos de atendimento extremamente longos.`;

        // Check exists
        const [exist1] = await connection.query('SELECT id FROM questoes WHERE enunciado LIKE ?', [enunciado1.substring(0, 50) + '%']);
        if (exist1.length > 0) {
            console.log('Questão 1 já existe. Pulando.');
        } else {
            const [res1] = await connection.query(
                'INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES (?, ?, ?, ?, ?)',
                [enunciado1, topicoId, 'dificil', 'multipla_escolha', 0]
            );
            const qid1 = res1.insertId;
            console.log(`Questão 1 inserida: ID ${qid1}`);

            const alts1 = [
                { t: 'Filial A: Leptocúrtica, Filial B: Platicúrtica. A Filial A tem maior risco de extremos.', c: false },
                { t: 'Ambas são mesocúrticas, pois possuem IQR similares. O risco de extremos é equivalente.', c: false },
                { t: 'Filial A: Mesocúrtica (K=0.25≈0.263), Filial B: Leptocúrtica (K=0.083<0.263). A Filial B apresenta maior risco de tempos extremos, pois suas caudas são mais pesadas.', c: true },
                { t: 'Filial A: Platicúrtica (K=0.25>0.263), Filial B: Mesocúrtica. A Filial A tem maior risco por ser mais achatada.', c: false },
                { t: 'Filial B: Platicúrtica, pois K menor indica distribuição mais achatada. Filial B tem menor risco.', c: false }
            ];

            const values1 = alts1.map((a, i) => [qid1, a.t, a.c, i + 1]);
            await connection.query('INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES ?', [values1]);
        }

        // --- QUESTION 2 ---
        const enunciado2 = `Em um processo de controle de qualidade, peças são medidas em milímetros. Foram coletados os percentis de duas máquinas:

**Máquina M1:**
• P₁₀ = 48 | Q₁ = 49 | Mediana = 50 | Q₃ = 51 | P₉₀ = 52

**Máquina M2:**
• P₁₀ = 44 | Q₁ = 49 | Mediana = 50 | Q₃ = 51 | P₉₀ = 56

Utilizando o Coeficiente de Curtose Percentílico:

K = IQR / [2 × (P₉₀ - P₁₀)]

Onde valores menores de K indicam caudas mais pesadas (leptocúrtica), qual máquina apresenta maior probabilidade de produzir peças fora das especificações?`;

        const [exist2] = await connection.query('SELECT id FROM questoes WHERE enunciado LIKE ?', [enunciado2.substring(0, 50) + '%']);
        if (exist2.length > 0) {
            console.log('Questão 2 já existe. Pulando.');
        } else {
            const [res2] = await connection.query(
                'INSERT INTO questoes (enunciado, topico_id, dificuldade, tipo, usa_imagem) VALUES (?, ?, ?, ?, ?)',
                [enunciado2, topicoId, 'dificil', 'multipla_escolha', 0]
            );
            const qid2 = res2.insertId;
            console.log(`Questão 2 inserida: ID ${qid2}`);

            const alts2 = [
                { t: 'Máquina M1 (K≈0.25): é mais leptocúrtica por ter menor amplitude interdecil.', c: false },
                { t: 'Ambas têm igual probabilidade de extremos, pois possuem o mesmo IQR e mediana.', c: false },
                { t: 'Máquina M2 é platicúrtica (K pequeno = achatada), portanto produz menos extremos.', c: false },
                { t: 'Máquina M2 (K≈0.083, leptocúrtica): tem caudas mais pesadas e maior probabilidade de valores extremos, mesmo com o mesmo IQR que M1.', c: true },
                { t: 'Não é possível determinar sem conhecer a média e o desvio padrão.', c: false }
            ];

            const values2 = alts2.map((a, i) => [qid2, a.t, a.c, i + 1]);
            await connection.query('INSERT INTO alternativas (questao_id, texto, correta, ordem) VALUES ?', [values2]);
        }

        console.log('✅ Sucesso!');

    } catch (err) {
        console.error('❌ Erro:', err);
    } finally {
        await connection.end();
    }
}

run();
