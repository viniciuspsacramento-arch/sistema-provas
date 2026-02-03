const { promisePool } = require('./db');

async function fixProcedures() {
    console.log('Iniciando correção de procedures e triggers...');

    try {
        const connection = await promisePool.getConnection();
        console.log('Conexão obtida.');

        // 1. Corrigir Procedure calcular_pontuacao
        console.log('Recriando procedure calcular_pontuacao...');
        await connection.query('DROP PROCEDURE IF EXISTS calcular_pontuacao');

        const createProcQuery = `
            CREATE PROCEDURE calcular_pontuacao(IN p_tentativa_id INT)
            BEGIN
                DECLARE v_total_questoes INT;
                DECLARE v_respostas_corretas DECIMAL(10,2);
                DECLARE v_pontuacao DECIMAL(5,2);
                
                -- Contar total de questões da prova
                SELECT COUNT(*) INTO v_total_questoes
                FROM provas_questoes pq
                JOIN tentativas t ON t.prova_id = pq.prova_id
                WHERE t.id = p_tentativa_id;
                
                -- Calcular acertos
                SELECT COUNT(*) INTO v_respostas_corretas
                FROM respostas r
                LEFT JOIN alternativas a ON r.alternativa_id = a.id
                WHERE r.tentativa_id = p_tentativa_id AND a.correta = 1;
                
                -- Calcular pontuação
                IF v_total_questoes > 0 THEN
                    SET v_pontuacao = (v_respostas_corretas / v_total_questoes) * 100;
                ELSE
                    SET v_pontuacao = 0;
                END IF;
                
                -- Atualizar tentativa
                UPDATE tentativas 
                SET pontuacao = v_pontuacao
                WHERE id = p_tentativa_id;
            END
        `;
        await connection.query(createProcQuery);
        console.log('✅ Procedure calcular_pontuacao recriada com sucesso.');

        // 2. Corrigir Trigger tr_verificar_resposta_correta
        console.log('Recriando trigger tr_verificar_resposta_correta...');
        await connection.query('DROP TRIGGER IF EXISTS tr_verificar_resposta_correta');

        const createTriggerQuery = `
            CREATE TRIGGER tr_verificar_resposta_correta
            BEFORE INSERT ON respostas
            FOR EACH ROW
            BEGIN
                IF NEW.alternativa_id IS NOT NULL THEN
                    SET NEW.correta = (SELECT correta FROM alternativas WHERE id = NEW.alternativa_id);
                END IF;
            END
        `;
        await connection.query(createTriggerQuery);
        console.log('✅ Trigger tr_verificar_resposta_correta recriada com sucesso.');

        // 3. Verificar estrutura da tabela respostas
        console.log('Verificando tabela respostas...');
        const [columns] = await connection.query('SHOW COLUMNS FROM respostas LIKE "correta"');
        if (columns.length === 0) {
            console.log('⚠️ Coluna "correta" não encontrada na tabela respostas. Adicionando...');
            await connection.query('ALTER TABLE respostas ADD COLUMN correta BOOLEAN DEFAULT FALSE');
            console.log('✅ Coluna "correta" adicionada.');
        } else {
            console.log('✅ Coluna "correta" já existe.');
        }

        connection.release();
        console.log('🎉 Correções aplicadas com sucesso! Tente finalizar a prova novamente.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Erro ao corrigir procedures:', error);
        process.exit(1);
    }
}

fixProcedures();
