// ============================================
// CONFIGURAÇÃO E ESTADO GLOBAL
// ============================================

// Configuração da API
// Em produção (Railway), usa o caminho relativo. Localmente, funciona igual se servido pelo mesmo host.
const API_URL = '/api';
let topicos = [];
let tags = [];

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
});

async function inicializarApp() {
    // Carregar dados iniciais
    await carregarTopicos();
    await carregarTags();

    // Configurar navegação
    configurarNavegacao();

    // Carregar página inicial
    carregarDashboard();
}

// ============================================
// NAVEGAÇÃO
// ============================================

function configurarNavegacao() {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pagina = btn.dataset.page;
            navegarPara(pagina);
        });
    });
}

function navegarPara(pagina) {
    // Atualizar botões de navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pagina) {
            btn.classList.add('active');
        }
    });

    // Esconder todas as páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });

    // Mostrar página selecionada
    const paginaElement = document.getElementById(`page-${pagina}`);
    if (paginaElement) {
        paginaElement.classList.remove('hidden');
    }

    // Carregar conteúdo da página
    switch (pagina) {
        case 'dashboard':
            carregarDashboard();
            break;
        case 'questoes':
            carregarQuestoes();
            break;
        case 'provas':
            carregarProvas();
            break;
        case 'realizar-prova':
            carregarProvasDisponiveis();
            break;
        case 'historico':
            carregarHistorico();
            break;
    }
}

// ============================================
// DASHBOARD
// ============================================

async function carregarDashboard() {
    try {
        const response = await fetch(`${API_URL}/estatisticas/dashboard`);
        const data = await response.json();

        // Renderizar estatísticas gerais
        const statsGrid = document.getElementById('statsGrid');
        const stats = data.estatisticas_gerais;

        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon">📝</div>
                <div class="stat-value">${stats.total_questoes || 0}</div>
                <div class="stat-label">Questões</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📋</div>
                <div class="stat-value">${stats.total_provas || 0}</div>
                <div class="stat-label">Provas</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">✍️</div>
                <div class="stat-value">${stats.total_tentativas || 0}</div>
                <div class="stat-label">Tentativas</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-value">${stats.total_alunos || 0}</div>
                <div class="stat-label">Alunos</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-value">${stats.media_geral !== null ? Number(stats.media_geral).toFixed(1) : '0.0'}</div>
                <div class="stat-label">Média Geral</div>
            </div>
        `;

        // Renderizar questões por tópico
        const questoesPorTopico = document.getElementById('questoesPorTopico');
        if (data.questoes_por_topico && data.questoes_por_topico.length > 0) {
            questoesPorTopico.innerHTML = data.questoes_por_topico.map(t => `
                <div style="padding: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <strong>${t.topico}</strong>
                        <span class="badge badge-primary">${t.total_questoes}</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem; font-size: 0.875rem;">
                        <span class="badge badge-facil">${t.faceis} fáceis</span>
                        <span class="badge badge-medio">${t.medias} médias</span>
                        <span class="badge badge-dificil">${t.dificeis} difíceis</span>
                    </div>
                </div>
            `).join('');
        } else {
            questoesPorTopico.innerHTML = '<p style="color: var(--text-muted); padding: 1rem;">Nenhuma questão cadastrada ainda.</p>';
        }

        // Renderizar top alunos
        const topAlunos = document.getElementById('topAlunos');
        if (data.top_alunos && data.top_alunos.length > 0) {
            topAlunos.innerHTML = `
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>Aluno</th>
                            <th>Provas</th>
                            <th>Média</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.top_alunos.map((aluno, index) => `
                            <tr>
                                <td>
                                    ${index < 3 ? ['🥇', '🥈', '🥉'][index] : ''} 
                                    ${aluno.nome_aluno}
                                </td>
                                <td>${aluno.total_provas}</td>
                                <td><strong>${aluno.media_pontuacao !== null ? Number(aluno.media_pontuacao).toFixed(1) : '0.0'}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            topAlunos.innerHTML = '<p style="color: var(--text-muted); padding: 1rem;">Nenhuma tentativa registrada ainda.</p>';
        }

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        mostrarErro('Erro ao carregar dashboard');
    }
}

// ============================================
// HISTÓRICO
// ============================================

async function carregarHistorico() {
    try {
        const response = await fetch(`${API_URL}/tentativas`);
        const tentativas = await response.json();

        const tbody = document.getElementById('tabelaHistorico');

        if (tentativas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhuma tentativa registrada</td></tr>';
            return;
        }

        tbody.innerHTML = tentativas.map(t => `
            <tr>
                <td>${t.nome_aluno}</td>
                <td>${t.prova_titulo}</td>
                <td>${formatarData(t.iniciado_em)}</td>
                <td>
                    ${t.pontuacao !== null ?
                `<strong style="color: ${getPontuacaoCor(t.pontuacao)}">${t.pontuacao.toFixed(1)}</strong>` :
                '<span class="badge badge-primary">Em andamento</span>'
            }
                </td>
                <td>
                    ${t.trocas_aba > 0 ?
                `<span class="badge badge-dificil">${t.trocas_aba}</span>` :
                '<span class="badge badge-facil">0</span>'
            }
                </td>
                <td>${t.tempo_total ? formatarTempo(t.tempo_total) : '-'}</td>
                <td>
                    ${t.finalizado_em ?
                `<button class="btn btn-sm btn-secondary" onclick="verResultado(${t.id})">Ver Resultado</button>` :
                '-'
            }
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        mostrarErro('Erro ao carregar histórico');
    }
}

function filtrarHistorico() {
    const busca = document.getElementById('buscarAluno').value.toLowerCase();
    const linhas = document.querySelectorAll('#tabelaHistorico tr');

    linhas.forEach(linha => {
        const nomeAluno = linha.cells[0]?.textContent.toLowerCase() || '';
        if (nomeAluno.includes(busca)) {
            linha.style.display = '';
        } else {
            linha.style.display = 'none';
        }
    });
}

async function verResultado(tentativaId) {
    try {
        const response = await fetch(`${API_URL}/tentativas/${tentativaId}/resultado`);
        const resultado = await response.json();

        const modal = document.getElementById('modalResultado');
        const content = document.getElementById('resultadoContent');

        content.innerHTML = `
            <div class="mb-3">
                <h4>${resultado.prova_titulo}</h4>
                <p style="color: var(--text-muted);">Aluno: ${resultado.nome_aluno}</p>
                <p style="color: var(--text-muted);">Data: ${formatarData(resultado.iniciado_em)}</p>
            </div>
            
            <div class="stats-grid mb-3">
                <div class="stat-card">
                    <div class="stat-value" style="color: ${getPontuacaoCor(resultado.pontuacao)}">${resultado.pontuacao.toFixed(1)}</div>
                    <div class="stat-label">Pontuação</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${resultado.estatisticas.corretas}/${resultado.estatisticas.total_questoes}</div>
                    <div class="stat-label">Acertos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${resultado.trocas_aba}</div>
                    <div class="stat-label">Trocas de Aba</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${formatarTempo(resultado.tempo_total)}</div>
                    <div class="stat-label">Tempo Total</div>
                </div>
            </div>
            
            <h5 class="mb-2">Respostas</h5>
            <div style="max-height: 400px; overflow-y: auto;">
                ${resultado.respostas.map((r, index) => `
                    <div class="card mb-2" style="padding: 1rem; ${r.correta ? 'border-left: 4px solid var(--success)' : 'border-left: 4px solid var(--error)'}">
                        <div class="flex-between mb-2">
                            <strong>Questão ${index + 1}</strong>
                            ${r.correta ?
                '<span class="badge badge-facil">✓ Correta</span>' :
                '<span class="badge badge-dificil">✗ Incorreta</span>'
            }
                        </div>
                        ${r.enunciado_imagem ?
                `<img src="${r.enunciado_imagem}" style="max-width: 100%; border-radius: var(--radius-md); margin-bottom: 0.5rem;">` :
                `<p>${r.enunciado}</p>`
            }
                        <p style="color: var(--text-muted); font-size: 0.875rem;">
                            Sua resposta: ${r.resposta_texto_alt || r.resposta_texto || 'Não respondida'}
                            ${!r.correta && r.gabarito_texto ? `<br>Resposta correta: ${r.gabarito_texto}` : ''}
                        </p>
                    </div>
                `).join('')}
            </div>
        `;

        modal.classList.add('active');

    } catch (error) {
        console.error('Erro ao carregar resultado:', error);
        mostrarErro('Erro ao carregar resultado');
    }
}

// ============================================
// UTILITÁRIOS
// ============================================

async function carregarTopicos() {
    try {
        const response = await fetch(`${API_URL}/topicos`);
        topicos = await response.json();

        // Atualizar selects de tópicos
        const selects = document.querySelectorAll('#filtroTopico, #questaoTopico, #gerarProvaTopico');
        selects.forEach(select => {
            const opcoes = topicos.map(t => `<option value="${t.id}">${t.nome}</option>`).join('');
            if (select.id === 'filtroTopico' || select.id === 'gerarProvaTopico') {
                select.innerHTML = '<option value="">Todos</option>' + opcoes;
            } else {
                select.innerHTML = opcoes;
            }
        });

    } catch (error) {
        console.error('Erro ao carregar tópicos:', error);
    }
}

async function carregarTags() {
    try {
        const response = await fetch(`${API_URL}/tags`);
        tags = await response.json();
    } catch (error) {
        console.error('Erro ao carregar tags:', error);
    }
}

function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function mostrarErro(mensagem) {
    alert('❌ ' + mensagem);
}

function mostrarSucesso(mensagem) {
    alert('✅ ' + mensagem);
}

function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatarTempo(segundos) {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
        return `${horas}h ${minutos}m`;
    } else if (minutos > 0) {
        return `${minutos}m ${segs}s`;
    } else {
        return `${segs}s`;
    }
}

function getPontuacaoCor(pontuacao) {
    if (pontuacao >= 70) return 'var(--success)';
    if (pontuacao >= 50) return 'var(--warning)';
    return 'var(--error)';
}

function getDificuldadeBadge(dificuldade) {
    const badges = {
        'facil': 'badge-facil',
        'medio': 'badge-medio',
        'dificil': 'badge-dificil'
    };
    return badges[dificuldade] || 'badge-primary';
}

function getDificuldadeTexto(dificuldade) {
    const textos = {
        'facil': 'Fácil',
        'medio': 'Médio',
        'dificil': 'Difícil'
    };
    return textos[dificuldade] || dificuldade;
}

// Fechar modal ao clicar fora
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
