// ============================================
// GERENCIAMENTO DE PROVAS
// ============================================

let provasCache = [];
let questoesSelecionadasIds = []; // Array ordenado de IDs

// ============================================
// CARREGAR PROVAS
// ============================================

async function carregarProvas() {
    try {
        const response = await fetch(`${API_URL}/provas`);
        provasCache = await response.json();

        renderizarProvas(provasCache);

    } catch (error) {
        console.error('Erro ao carregar provas:', error);
        mostrarErro('Erro ao carregar provas');
    }
}

function renderizarProvas(provas) {
    const container = document.getElementById('listaProvas');

    if (provas.length === 0) {
        container.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: var(--text-muted);">Nenhuma prova cadastrada</p>';
        return;
    }

    container.innerHTML = provas.map(p => `
        <div class="card">
            <div class="flex-between mb-2">
                <div>
                    <h4 style="margin: 0;">${p.titulo}</h4>
                    ${p.titulo_publico ? `<small style="color: var(--text-muted);">Público: ${p.titulo_publico}</small>` : ''}
                </div>
                <button class="btn btn-sm btn-danger" onclick="deletarProva(${p.id})" title="Deletar">
                    🗑️
                </button>
            </div>
            
            ${p.descricao ? `<p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">${p.descricao}</p>` : ''}
            
            <div style="display: flex; gap: 1rem; font-size: 0.875rem; color: var(--text-muted);">
                <div>📝 ${p.total_questoes} questões</div>
                ${p.tempo_limite ? `<div>⏱️ ${p.tempo_limite} min</div>` : '<div>⏱️ Sem limite</div>'}
            </div>
            
            <div class="flex gap-2 mt-3">
                <button class="btn btn-sm btn-secondary" onclick="verProva(${p.id})">
                    👁️ Ver Detalhes
                </button>
                <button class="btn btn-sm btn-primary" onclick="editarProva(${p.id})">
                    ✏️ Editar
                </button>
            </div>
        </div>
    `).join('');
}

async function verProva(id) {
    try {
        const response = await fetch(`${API_URL}/provas/${id}?incluir_gabarito=true`);
        const prova = await response.json();

        let detalhes = `
            <h3>${prova.titulo}</h3>
            ${prova.descricao ? `<p>${prova.descricao}</p>` : ''}
            <p><strong>Questões:</strong> ${prova.questoes.length}</p>
            ${prova.tempo_limite ? `<p><strong>Tempo:</strong> ${prova.tempo_limite} minutos</p>` : ''}
            <hr>
            <h4>Questões:</h4>
        `;

        prova.questoes.forEach((q, index) => {
            detalhes += `
                <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--bg-tertiary); border-radius: var(--radius-md);">
                    <strong>${index + 1}.</strong>
                    ${q.enunciado ? `<div>${q.enunciado}</div>` : ''}
                    ${q.enunciado_imagem ? `<img src="${q.enunciado_imagem}" alt="Imagem do enunciado" style="max-width: 100%; margin-top: 0.5rem; border-radius: 4px;">` : ''}

                    <div style="margin-top: 0.5rem;">
                        ${q.alternativas.map((alt, i) => `
                            <div style="margin: 0.5rem 0; ${alt.correta ? 'color: var(--success); font-weight: 600;' : ''}">
                                ${String.fromCharCode(65 + i)}) 
                                ${alt.texto ? `<span>${alt.texto}</span>` : ''}
                                ${alt.imagem ? `<img src="${alt.imagem}" alt="Alternativa" style="max-height: 100px; vertical-align: middle; margin-left: 0.5rem;">` : ''}
                                ${alt.correta ? ' ✓' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        // Criar modal temporário para mostrar detalhes
        const modalTemp = document.createElement('div');
        modalTemp.className = 'modal active';
        modalTemp.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3 class="modal-title">Detalhes da Prova</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div style="max-height: 70vh; overflow-y: auto;">
                    ${detalhes}
                </div>
            </div>
        `;
        document.body.appendChild(modalTemp);

    } catch (error) {
        console.error('Erro ao carregar prova:', error);
        mostrarErro('Erro ao carregar prova');
    }
}

async function deletarProva(id) {
    if (!confirm('ATENÇÃO: Deletar esta prova irá apagar TODO O HISTÓRICO de tentativas dos alunos associado a ela.\n\nTem certeza absoluta que deseja continuar?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/provas/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            mostrarSucesso('Prova deletada com sucesso');
            carregarProvas();
        } else {
            mostrarErro('Erro ao deletar prova');
        }
    } catch (error) {
        console.error('Erro ao deletar prova:', error);
        mostrarErro('Erro ao deletar prova');
    }
}

// ============================================
// CRIAR PROVA MANUAL
// ============================================

async function abrirModalNovaProva() {
    // Resetar formulário
    document.getElementById('formProva').reset();
    document.getElementById('provaId').value = '';
    document.getElementById('modalProvaTitle').textContent = 'Nova Prova';

    questoesSelecionadasIds = []; // Resetar seleção
    renderizarQuestoesSelecionadas();

    // Carregar questões disponíveis
    await carregarQuestoesParaModal();
    abrirModal('modalProva');
}

async function editarProva(id) {
    try {
        // Obter dados da prova
        const response = await fetch(`${API_URL}/provas/${id}`);
        const prova = await response.json();

        // Preencher formulário
        document.getElementById('provaId').value = prova.id;
        document.getElementById('provaTitulo').value = prova.titulo;
        document.getElementById('provaTituloPublico').value = prova.titulo_publico || '';
        document.getElementById('provaDescricao').value = prova.descricao || '';
        document.getElementById('provaTempoLimite').value = prova.tempo_limite || '';
        document.getElementById('modalProvaTitle').textContent = 'Editar Prova';

        // Carregar questões e selecionar
        await carregarQuestoesParaModal();

        // Configurar ordem das questões
        questoesSelecionadasIds = prova.questoes.map(q => q.id);

        // Marcar checkboxes
        questoesSelecionadasIds.forEach(id => {
            const cb = document.querySelector(`.questao-checkbox[value="${id}"]`);
            if (cb) cb.checked = true;
        });

        renderizarQuestoesSelecionadas();
        abrirModal('modalProva');

    } catch (error) {
        console.error('Erro ao carregar prova para edição:', error);
        mostrarErro('Erro ao carregar prova');
    }
}

async function carregarQuestoesParaModal() {
    try {
        const response = await fetch(`${API_URL}/questoes`);
        const questoes = await response.json();

        // Salvar questões globais para acesso fácil aos detalhes
        window.todasQuestoes = questoes;

        const container = document.getElementById('questoesDisponiveis');
        container.innerHTML = questoes.map(q => `
            <div style="padding: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <label style="display: flex; align-items: start; gap: 0.75rem; cursor: pointer;">
                    <input type="checkbox" class="questao-checkbox" value="${q.id}" style="margin-top: 0.25rem;" onchange="toggleQuestaoSelecao(this)">
                    <div style="flex: 1;">
                        <div style="margin-bottom: 0.25rem;">
                            ${q.enunciado ? (q.enunciado.substring(0, 100) + (q.enunciado.length > 100 ? '...' : '')) : '(Questão com imagem)'}
                        </div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">
                            ${q.topico_nome} • 
                            <span class="badge ${getDificuldadeBadge(q.dificuldade)}">${getDificuldadeTexto(q.dificuldade)}</span>
                        </div>
                    </div>
                </label>
            </div>
        `).join('');

    } catch (error) {
        console.error('Erro ao carregar questões:', error);
    }
}

function toggleQuestaoSelecao(checkbox) {
    const id = parseInt(checkbox.value);
    if (checkbox.checked) {
        // Adicionar ao final se não existir
        if (!questoesSelecionadasIds.includes(id)) {
            questoesSelecionadasIds.push(id);
        }
    } else {
        // Remover
        questoesSelecionadasIds = questoesSelecionadasIds.filter(qId => qId !== id);
    }
    renderizarQuestoesSelecionadas();
}

function renderizarQuestoesSelecionadas() {
    const container = document.getElementById('questoesSelecionadasLista');

    if (questoesSelecionadasIds.length === 0) {
        container.innerHTML = '<p class="text-muted" style="padding: 1rem; text-align: center; border: 1px dashed var(--border-color); border-radius: var(--radius-md);">Nenhuma questão selecionada</p>';
        return;
    }

    container.innerHTML = questoesSelecionadasIds.map((id, index) => {
        const questao = window.todasQuestoes ? window.todasQuestoes.find(q => q.id === id) : null;
        if (!questao) return `
            <div class="card p-2 mb-2 flex-between" style="background: var(--bg-tertiary); border: 1px solid var(--border-color);">
                <div>Questão #${id} (Carregando...)</div>
                <button type="button" class="btn btn-sm btn-danger" onclick="removerQuestaoDaLista(${id})">✖️</button>
            </div>`;

        return `
            <div class="card p-2 mb-2 flex-between" style="background: var(--bg-tertiary); border: 1px solid var(--border-color);">
                <div style="font-size: 0.9rem;">
                    <strong style="margin-right: 0.5rem;">${index + 1}.</strong>
                    ${questao.enunciado ? (questao.enunciado.substring(0, 60) + '...') : '(Imagem)'}
                </div>
                <div class="flex gap-1">
                    <button type="button" class="btn btn-sm btn-secondary" onclick="moverQuestao(${index}, -1)" ${index === 0 ? 'disabled' : ''} title="Subir">⬆️</button>
                    <button type="button" class="btn btn-sm btn-secondary" onclick="moverQuestao(${index}, 1)" ${index === questoesSelecionadasIds.length - 1 ? 'disabled' : ''} title="Descer">⬇️</button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="removerQuestaoDaLista(${id})" title="Remover">✖️</button>
                </div>
            </div>
        `;
    }).join('');
}

function moverQuestao(index, direcao) {
    const novoIndex = index + direcao;
    if (novoIndex < 0 || novoIndex >= questoesSelecionadasIds.length) return;

    // Swap
    const temp = questoesSelecionadasIds[index];
    questoesSelecionadasIds[index] = questoesSelecionadasIds[novoIndex];
    questoesSelecionadasIds[novoIndex] = temp;

    renderizarQuestoesSelecionadas();
}

function removerQuestaoDaLista(id) {
    // Desmarcar checkbox
    const cb = document.querySelector(`.questao-checkbox[value="${id}"]`);
    if (cb) {
        cb.checked = false;
    }
    toggleQuestaoSelecao({ value: id, checked: false });
}

async function salvarProva(event) {
    event.preventDefault();

    try {
        if (questoesSelecionadasIds.length === 0) {
            mostrarErro('Selecione pelo menos uma questão');
            return;
        }

        const id = document.getElementById('provaId').value;
        const prova = {
            titulo: document.getElementById('provaTitulo').value,
            titulo_publico: document.getElementById('provaTituloPublico').value,
            descricao: document.getElementById('provaDescricao').value,
            tempo_limite: document.getElementById('provaTempoLimite').value ?
                parseInt(document.getElementById('provaTempoLimite').value) : null,
            questoes: questoesSelecionadasIds // Envia o array ORDENADO
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/provas/${id}` : `${API_URL}/provas`;
        const mensagemSucesso = id ? 'Prova atualizada com sucesso!' : 'Prova criada com sucesso!';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prova)
        });

        if (response.ok) {
            mostrarSucesso(mensagemSucesso);
            fecharModal('modalProva');
            carregarProvas();
        } else {
            // Tenta ler como texto caso não seja JSON válido
            const textBody = await response.text();
            console.error('Erro servidor:', textBody);
            try {
                const errorData = JSON.parse(textBody);
                alert(`Erro ao salvar: ${errorData.error || JSON.stringify(errorData)}`);
            } catch (e) {
                alert(`Erro no servidor (${response.status}): ${textBody.substring(0, 200)}`);
            }
        }

    } catch (error) {
        console.error('Erro ao salvar prova:', error);
        alert(`Erro de conexão ou código: ${error.message}`);
    }
}

// ============================================
// GERAR PROVA AUTOMATICAMENTE
// ============================================

function abrirModalGerarProva() {
    document.getElementById('formGerarProva').reset();
    abrirModal('modalGerarProva');
}

async function gerarProva(event) {
    event.preventDefault();

    try {
        const criterios = {
            topico_id: document.getElementById('gerarProvaTopico').value || null,
            dificuldade: document.getElementById('gerarProvaDificuldade').value || null,
            quantidade: parseInt(document.getElementById('gerarProvaQuantidade').value)
        };

        const prova = {
            titulo: document.getElementById('gerarProvaTitulo').value,
            titulo_publico: document.getElementById('gerarProvaTituloPublico').value,
            descricao: document.getElementById('gerarProvaDescricao').value,
            tempo_limite: document.getElementById('gerarProvaTempoLimite').value ?
                parseInt(document.getElementById('gerarProvaTempoLimite').value) : null,
            criterios: criterios
        };

        const response = await fetch(`${API_URL}/provas/gerar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prova)
        });

        if (response.ok) {
            const resultado = await response.json();
            mostrarSucesso(`Prova gerada com sucesso! ${resultado.total_questoes} questões adicionadas.`);
            fecharModal('modalGerarProva');
            carregarProvas();
        } else {
            const error = await response.json();
            mostrarErro(error.error || 'Erro ao gerar prova');
        }

    } catch (error) {
        console.error('Erro ao gerar prova:', error);
        mostrarErro('Erro ao gerar prova');
    }
}
