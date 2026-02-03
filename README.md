# 📊 Banco de Questões de Estatística

Sistema completo para gerenciar questões de estatística e realizar provas com proteções anti-cópia.

## ✨ Funcionalidades

### 📝 Gerenciamento de Questões
- ✅ Cadastro de questões com **suporte a imagens** (enunciado e alternativas)
- ✅ Organização por tópicos, dificuldade e tags
- ✅ Filtros avançados de busca
- ✅ Múltiplas alternativas por questão

### 📋 Gerenciamento de Provas
- ✅ Criação manual de provas
- ✅ **Geração automática** baseada em critérios (tópico, dificuldade, quantidade)
- ✅ Definição de tempo limite
- ✅ Visualização de provas com gabarito

### ✍️ Realização de Provas
- ✅ Interface intuitiva para responder questões
- ✅ Timer com contagem regressiva
- ✅ **Proteções anti-cópia:**
  - 🔒 Desabilitação de seleção de texto
  - 🔒 Bloqueio de clique direito
  - 🔒 Bloqueio de atalhos (Ctrl+C, Ctrl+V, etc.)
  - 🔒 Marca d'água com nome do aluno
  - 🔒 Detecção e registro de trocas de aba/janela
- ✅ Correção automática
- ✅ Resultado detalhado com estatísticas

### 📊 Estatísticas e Histórico
- ✅ Dashboard com visão geral
- ✅ Histórico de tentativas
- ✅ Ranking de alunos
- ✅ Análise de desempenho

## 🚀 Instalação

### Pré-requisitos

1. **Node.js** (versão 14 ou superior)
   - Download: https://nodejs.org/

2. **MySQL** (versão 8.0 ou superior)
   - Veja [INSTALL.md](INSTALL.md) para instruções detalhadas de instalação no Windows

### Passo a Passo

1. **Clone ou baixe este repositório**

2. **Instale as dependências do Node.js**
   ```bash
   npm install
   ```

3. **Configure o banco de dados**
   
   a. Crie um arquivo `.env` baseado no `.env.example`:
   ```bash
   copy .env.example .env
   ```
   
   b. Edite o arquivo `.env` com suas credenciais do MySQL:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=sua_senha_aqui
   DB_NAME=banco_questoes_estatistica
   DB_PORT=3306
   PORT=3000
   ```

4. **Crie o banco de dados**
   
   Abra o MySQL Workbench ou linha de comando do MySQL e execute:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

5. **Popule com dados de exemplo (opcional)**
   ```bash
   mysql -u root -p < database/seed.sql
   ```

6. **Inicie o servidor**
   ```bash
   npm start
   ```

7. **Acesse o sistema**
   
   Abra seu navegador em: http://localhost:3000

## 📁 Estrutura do Projeto

```
banco-questoes-estatistica/
├── database/
│   ├── schema.sql          # Estrutura do banco de dados
│   └── seed.sql            # Dados de exemplo
├── public/
│   ├── css/
│   │   └── styles.css      # Estilos da aplicação
│   ├── js/
│   │   ├── app.js          # Lógica principal
│   │   ├── questoes.js     # Gerenciamento de questões
│   │   ├── provas.js       # Gerenciamento de provas
│   │   └── realizar-prova.js # Interface de realização de provas
│   ├── uploads/            # Imagens enviadas
│   └── index.html          # Página principal
├── server.js               # Servidor Express
├── db.js                   # Configuração do banco de dados
├── package.json            # Dependências do projeto
├── .env.example            # Template de configuração
└── README.md               # Este arquivo
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

- **topicos**: Tópicos de estatística
- **questoes**: Questões com suporte a imagens
- **alternativas**: Alternativas das questões
- **tags**: Tags para categorização
- **provas**: Provas criadas
- **tentativas**: Histórico de provas realizadas
- **respostas**: Respostas dos alunos

### Views

- **v_questoes_por_topico**: Estatísticas de questões por tópico
- **v_desempenho_alunos**: Desempenho médio dos alunos

### Procedures

- **calcular_pontuacao**: Calcula automaticamente a pontuação de uma tentativa

## 🔌 API Endpoints

### Questões
- `GET /api/questoes` - Listar questões (com filtros)
- `GET /api/questoes/:id` - Obter questão específica
- `POST /api/questoes` - Criar nova questão
- `PUT /api/questoes/:id` - Atualizar questão
- `DELETE /api/questoes/:id` - Deletar questão

### Provas
- `GET /api/provas` - Listar provas
- `GET /api/provas/:id` - Obter prova específica
- `POST /api/provas` - Criar nova prova
- `POST /api/provas/gerar` - Gerar prova automaticamente
- `DELETE /api/provas/:id` - Deletar prova

### Tentativas
- `POST /api/tentativas` - Iniciar tentativa
- `POST /api/tentativas/:id/responder` - Submeter resposta
- `POST /api/tentativas/:id/troca-aba` - Registrar troca de aba
- `POST /api/tentativas/:id/finalizar` - Finalizar prova
- `GET /api/tentativas/:id/resultado` - Obter resultado
- `GET /api/tentativas` - Listar tentativas

### Outros
- `POST /api/upload` - Upload de imagem
- `GET /api/topicos` - Listar tópicos
- `POST /api/topicos` - Criar tópico
- `GET /api/tags` - Listar tags
- `POST /api/tags` - Criar tag
- `GET /api/estatisticas/dashboard` - Estatísticas gerais

## 💡 Como Usar

### 1. Cadastrar Questões

1. Acesse a aba **"Questões"**
2. Clique em **"Nova Questão"**
3. Escolha se quer usar imagem (recomendado para evitar cópia)
4. Preencha os dados:
   - Tópico
   - Enunciado (texto ou imagem)
   - Dificuldade
   - Tipo (múltipla escolha ou verdadeiro/falso)
   - Alternativas (texto ou imagem)
5. Marque a alternativa correta
6. Salve a questão

### 2. Criar Provas

**Opção A: Manual**
1. Acesse a aba **"Provas"**
2. Clique em **"Nova Prova"**
3. Defina título, descrição e tempo limite
4. Selecione as questões desejadas
5. Salve a prova

**Opção B: Automática**
1. Acesse a aba **"Provas"**
2. Clique em **"Gerar Automaticamente"**
3. Defina critérios (tópico, dificuldade, quantidade)
4. O sistema selecionará questões aleatórias

### 3. Realizar Provas

1. Acesse a aba **"Realizar Prova"**
2. Digite seu nome
3. Selecione a prova desejada
4. Leia o aviso sobre as proteções
5. Responda as questões
6. Finalize e veja seu resultado

### 4. Consultar Histórico

1. Acesse a aba **"Histórico"**
2. Veja todas as tentativas realizadas
3. Clique em **"Ver Resultado"** para detalhes
4. Analise acertos, erros e comportamento

## 🔒 Proteções Anti-Cópia

O sistema implementa várias camadas de proteção:

1. **Questões em Imagem**: Dificulta consultas a IAs
2. **Desabilitação de Seleção**: Impede copiar texto
3. **Bloqueio de Clique Direito**: Remove menu de contexto
4. **Bloqueio de Atalhos**: Ctrl+C, Ctrl+V, Ctrl+X, etc.
5. **Marca d'Água**: Nome do aluno sobreposto
6. **Detecção de Trocas de Aba**: Registra e avisa o aluno
7. **Timer**: Limita o tempo de prova

**Nota**: Estas proteções reduzem significativamente a possibilidade de cola, mas não a eliminam completamente. Use em conjunto com outras medidas de segurança.

## 🎨 Personalização

### Cores e Tema

Edite as variáveis CSS em `public/css/styles.css`:

```css
:root {
    --primary: #6366f1;
    --secondary: #8b5cf6;
    --accent: #ec4899;
    /* ... */
}
```

### Tempo Padrão de Provas

Edite no formulário de criação de provas ou via API.

### Quantidade de Alternativas

Modifique a função `adicionarAlternativa()` em `public/js/questoes.js`.

## 🐛 Solução de Problemas

### Erro de Conexão com o Banco de Dados

- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `mysql -u root -p`

### Imagens Não Aparecem

- Verifique se a pasta `public/uploads` existe
- Confirme as permissões da pasta
- Verifique o console do navegador para erros

### Servidor Não Inicia

- Verifique se a porta 3000 está livre
- Confirme que todas as dependências foram instaladas: `npm install`
- Veja os logs de erro no terminal

## 📝 Licença

MIT License - Sinta-se livre para usar e modificar este projeto.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

## 📧 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para facilitar o ensino de Estatística**
