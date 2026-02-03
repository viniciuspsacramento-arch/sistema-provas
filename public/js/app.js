// ============================================
// CONFIGURAÇÃO E ESTADO GLOBAL
// ============================================

// Configuração da API
window.API_URL = '/api';
let topicos = [];
let tags = [];

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 App iniciando...');

    // Failsafe: Se por algum motivo o app travar, mostrar o conteúdo após 2s
    setTimeout(() => {
        const nav = document.getElementById('mainNav');
        const dash = document.getElementById('page-dashboard');

        // Se ainda estiver oculto e o usuário for admin
        const isAdmin = new URLSearchParams(window.location.search).has('admin');
        if (isAdmin && nav && nav.style.display === 'none') {
            console.warn('⚠️ Failsafe ativado: Forçando exibição da UI');
            nav.style.display = 'flex';
            if (dash) dash.style.display = 'block';

            // Garantir que não estamos em loading eterno
            document.querySelectorAll('.loading').forEach(el => {
                el.innerHTML = '<p class="text-danger">Tempo limite excedido. Tente recarregar.</p>';
            });
        }
    }, 2000);

    inicializarApp();
});

async function inicializarApp() {
    try {
        // Verificar modo de acesso
        const isAdmin = new URLSearchParams(window.location.search).has('admin');
        console.log('📋 Modo:', isAdmin ? 'ADMIN' : 'ALUNO');

        if (isAdmin) {
            // MODO_ADMIN: Verificar Autenticação
            const token = sessionStorage.getItem('adminToken');

            if (!token) {
                console.log('🔒 Admin não autenticado. Exibindo login.');
                document.body.classList.add('mode-admin-locked');
                const modal = document.getElementById('modalLogin');
                if (modal) modal.style.display = 'flex';
                return; // Interrompe carregamento do dashboard
            }

            // MODO_ADMIN (Autenticado): Carregar tudo
            console.log('🔓 Admin autenticado. Carregando dashboard...');
            document.body.classList.add('mode-admin');

            // Mostrar navegação
            const nav = document.getElementById('mainNav');
            if (nav) nav.style.display = 'flex';

            configurarNavegacao();

            // Mostrar dashboard explicitamente (antes de carregar dados)
            const dash = document.getElementById('page-dashboard');
            if (dash) dash.style.display = 'block';

            // Carregar dados em paralelo para não travar a UI
            carregarDashboard().catch(e => console.error('Erro dashboard:', e));
            carregarTopicos().catch(e => console.error('Erro tópicos:', e));
            carregarTags().catch(e => console.error('Erro tags:', e));

        } else {
            // MODO_ALUNO: Apenas realizar prova
            document.body.classList.add('mode-aluno');
            console.log('👨‍🎓 Iniciando modo aluno...');

            // Esconder navegação
            const nav = document.getElementById('mainNav');
            if (nav) nav.style.display = 'none';

            // Mostrar apenas a página de realizar prova
            document.querySelectorAll('.page').forEach(page => {
                page.classList.add('hidden');
            });

            const pageRealizarProva = document.getElementById('page-realizar-prova');
            if (pageRealizarProva) {
                pageRealizarProva.classList.remove('hidden');
                console.log('✅ Página de realizar prova exibida');
            }

            // Carregar lista de provas disponíveis
            try {
                console.log('📥 Carregando provas disponíveis...');
                await carregarProvasDisponiveis();
                console.log('✅ Provas carregadas com sucesso');
            } catch (e) {
                console.error('❌ Erro ao carregar provas:', e);
                // Mostrar mensagem de erro amigável
                const container = document.getElementById('listaProvasRealizar');
                if (container) {
                    container.innerHTML = `
                        <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                            <p style="color: var(--error); font-size: 1.1rem; margin-bottom: 1rem;">
                                ❌ Erro ao carregar provas
                            </p>
                            <p style="color: var(--text-muted);">
                                Tente recarregar a página. Se o problema persistir, contate o administrador.
                            </p>
                            <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 1rem;">
                                🔄 Recarregar Página
                            </button>
                        </div>
                    `;
                }
            }
        }

        console.log('✅ App inicializado com sucesso');
    } catch (error) {
        console.error('❌ Erro fatal ao inicializar app:', error);
    }
}

// ============================================
// AUTENTICAÇÃO ADMIN
// ============================================

async function realizarLogin(event) {
    event.preventDefault();

    const senhaInput = document.getElementById('senhaAdmin');
    const erroDiv = document.getElementById('loginError');
    const botao = event.target.querySelector('button');

    if (!senhaInput) return;

    // Resetar estado
    erroDiv.style.display = 'none';
    botao.disabled = true;
    botao.textContent = 'Verificando...';

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: senhaInput.value })
        });

        if (!response.ok) {
            // Tenta ler o erro como texto primeiro para diagnosticar
            const text = await response.text();
            let errorMessage = `Erro ${response.status}`;

            try {
                const json = JSON.parse(text);
                if (json.error) errorMessage = json.error;
            } catch (e) {
                // Se não for JSON (ex: erro 500 do express em HTML), loga no console
                console.error('Resposta do servidor não é JSON:', text);
                if (response.status === 404) errorMessage = 'API não encontrada (404)';
                if (response.status === 500) errorMessage = 'Erro interno do servidor (500)';
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();

        if (data.success) {
            // Sucesso!
            sessionStorage.setItem('adminToken', data.token);
            location.reload(); // Recarrega para entrar no fluxo autenticado
        } else {
            throw new Error(data.error || 'Credenciais inválidas');
        }
    } catch (error) {
        console.error('Erro detalhado no login:', error);
        erroDiv.textContent = error.message === 'Failed to fetch'
            ? 'Não foi possível conectar ao servidor. Verifique se ele está rodando.'
            : `Erro: ${error.message}`;

        erroDiv.style.display = 'block';
        botao.disabled = false;
        botao.textContent = 'Entrar';
    }
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
    const statsGrid = document.getElementById('statsGrid');
    const questoesPorTopico = document.getElementById('questoesPorTopico');
    const topAlunos = document.getElementById('topAlunos');

    // Estado de Loading Visual
    if (statsGrid) {
        statsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <div class="loading"></div>
                <p class="mt-2 text-muted">Carregando estatísticas...</p>
            </div>
        `;
    }

    try {
        const response = await fetch(`${API_URL}/estatisticas/dashboard`);

        if (!response.ok) {
            throw new Error(`Erro do servidor: ${response.status}`);
        }

        const data = await response.json();

        // Verificar por erro retornado na API
        if (data.error) {
            throw new Error(data.error);
        }

        // Renderizar estatísticas gerais
        const stats = data.estatisticas_gerais || {};

        if (statsGrid) {
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
                    <div class="stat-value">${stats.media_geral ? Number(stats.media_geral).toFixed(1) : '0.0'}</div>
                    <div class="stat-label">Média Geral</div>
                </div>
            `;
        }

        // Renderizar questões por tópico
        if (questoesPorTopico) {
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
                questoesPorTopico.innerHTML = '<p style="color: var(--text-muted); padding: 1rem;">Nenhuma questão cadastrada por tópico.</p>';
            }
        }

        // Renderizar top alunos
        if (topAlunos) {
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
                topAlunos.innerHTML = '<p style="color: var(--text-muted); padding: 1rem;">Nenhuma tentativa registrada para ranking.</p>';
            }
        }

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        if (statsGrid) {
            statsGrid.innerHTML = `
                <div class="card" style="grid-column: 1/-1; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--error);">
                    <h3 style="color: var(--error); margin-bottom: 0.5rem;">❌ Erro ao carregar dados</h3>
                    <p>${error.message}</p>
                    <button class="btn btn-sm btn-secondary mt-2" onclick="carregarDashboard()">🔄 Tentar Novamente</button>
                </div>
            `;
        }
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
