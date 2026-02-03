# 🔧 Guia de Instalação do MySQL no Windows

Este guia fornece instruções passo a passo para instalar e configurar o MySQL no Windows.

## 📥 Download do MySQL

1. Acesse o site oficial: https://dev.mysql.com/downloads/installer/
2. Baixe o **MySQL Installer for Windows** (recomendado: versão completa ~400MB)
3. Escolha a opção **"Windows (x86, 32-bit), MSI Installer"** ou **"Windows (x86, 64-bit), MSI Installer"**

## 🚀 Instalação

### Passo 1: Executar o Instalador

1. Execute o arquivo `.msi` baixado
2. Se aparecer aviso de segurança, clique em **"Executar"**

### Passo 2: Escolher Tipo de Instalação

1. Selecione **"Developer Default"** (recomendado) ou **"Server only"**
2. Clique em **"Next"**

### Passo 3: Verificar Requisitos

1. O instalador verificará requisitos necessários
2. Se faltar algo, clique em **"Execute"** para instalar
3. Clique em **"Next"** quando tudo estiver OK

### Passo 4: Instalação dos Componentes

1. Revise os componentes que serão instalados
2. Clique em **"Execute"** para iniciar a instalação
3. Aguarde a conclusão (pode levar alguns minutos)
4. Clique em **"Next"**

### Passo 5: Configuração do Servidor MySQL

#### 5.1 Tipo e Rede

1. **Config Type**: Selecione **"Development Computer"**
2. **Connectivity**: Mantenha as configurações padrão
   - TCP/IP: ✓ (habilitado)
   - Port: 3306
3. Clique em **"Next"**

#### 5.2 Método de Autenticação

1. Selecione **"Use Strong Password Encryption"** (recomendado)
2. Clique em **"Next"**

#### 5.3 Configurar Senha do Root

1. Digite uma senha forte para o usuário **root**
2. **IMPORTANTE**: Anote esta senha! Você precisará dela
3. (Opcional) Adicione outros usuários se desejar
4. Clique em **"Next"**

#### 5.4 Configurar como Serviço do Windows

1. **Windows Service Name**: MySQL80 (padrão)
2. **Start the MySQL Server at System Startup**: ✓ (marcado)
3. **Run Windows Service as**: Standard System Account
4. Clique em **"Next"**

#### 5.5 Aplicar Configuração

1. Clique em **"Execute"** para aplicar as configurações
2. Aguarde a conclusão
3. Clique em **"Finish"**

### Passo 6: Finalizar Instalação

1. Clique em **"Next"** nas telas restantes
2. Clique em **"Finish"** para concluir

## ✅ Verificar Instalação

### Opção 1: MySQL Workbench (Interface Gráfica)

1. Abra o **MySQL Workbench** (instalado junto com o MySQL)
2. Clique na conexão **"Local instance MySQL80"**
3. Digite a senha do root
4. Se conectar com sucesso, está funcionando! ✅

### Opção 2: Linha de Comando

1. Abra o **Prompt de Comando** (cmd)
2. Digite:
   ```bash
   mysql -u root -p
   ```
3. Digite a senha do root
4. Se aparecer `mysql>`, está funcionando! ✅
5. Para sair, digite: `exit`

## 🗄️ Criar o Banco de Dados do Projeto

### Opção 1: Via MySQL Workbench

1. Abra o MySQL Workbench
2. Conecte-se ao servidor
3. Clique em **File > Open SQL Script**
4. Navegue até a pasta do projeto e selecione `database/schema.sql`
5. Clique no ícone de **raio** (⚡) para executar
6. Repita o processo para `database/seed.sql` (dados de exemplo)

### Opção 2: Via Linha de Comando

1. Abra o Prompt de Comando
2. Navegue até a pasta do projeto:
   ```bash
   cd C:\Users\Vinicius\.gemini\antigravity\scratch\banco-questoes-estatistica
   ```
3. Execute o schema:
   ```bash
   mysql -u root -p < database\schema.sql
   ```
4. Execute os dados de exemplo:
   ```bash
   mysql -u root -p < database\seed.sql
   ```

## ⚙️ Configurar o Projeto

1. Na pasta do projeto, copie o arquivo `.env.example` para `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edite o arquivo `.env` com um editor de texto (Notepad, VS Code, etc.):
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=SUA_SENHA_AQUI
   DB_NAME=banco_questoes_estatistica
   DB_PORT=3306
   PORT=3000
   ```

3. Substitua `SUA_SENHA_AQUI` pela senha que você definiu para o root

## 🔧 Comandos Úteis do MySQL

### Iniciar/Parar o Serviço MySQL

**Via Serviços do Windows:**
1. Pressione `Win + R`
2. Digite `services.msc` e pressione Enter
3. Procure por **MySQL80**
4. Clique com botão direito > **Iniciar** ou **Parar**

**Via Linha de Comando (como Administrador):**
```bash
# Iniciar
net start MySQL80

# Parar
net stop MySQL80

# Reiniciar
net stop MySQL80 && net start MySQL80
```

### Verificar Status do Servidor

```bash
mysql -u root -p -e "SELECT VERSION();"
```

### Listar Bancos de Dados

```bash
mysql -u root -p -e "SHOW DATABASES;"
```

### Acessar um Banco Específico

```bash
mysql -u root -p banco_questoes_estatistica
```

## 🐛 Solução de Problemas Comuns

### "mysql" não é reconhecido como comando

**Solução**: Adicionar MySQL ao PATH do Windows

1. Pressione `Win + Pause/Break` (ou vá em Configurações > Sistema > Sobre)
2. Clique em **"Configurações avançadas do sistema"**
3. Clique em **"Variáveis de Ambiente"**
4. Em **"Variáveis do sistema"**, encontre **Path** e clique em **"Editar"**
5. Clique em **"Novo"** e adicione:
   ```
   C:\Program Files\MySQL\MySQL Server 8.0\bin
   ```
6. Clique em **OK** em todas as janelas
7. **Feche e reabra** o Prompt de Comando

### Erro: "Access denied for user 'root'@'localhost'"

**Solução**: Senha incorreta

- Verifique se está digitando a senha correta
- Se esqueceu a senha, será necessário resetá-la (processo mais complexo)

### Erro: "Can't connect to MySQL server on 'localhost'"

**Solução**: Serviço MySQL não está rodando

1. Abra `services.msc`
2. Procure **MySQL80**
3. Clique com botão direito > **Iniciar**

### Porta 3306 já está em uso

**Solução**: Outra aplicação está usando a porta

1. Identifique qual aplicação está usando:
   ```bash
   netstat -ano | findstr :3306
   ```
2. Encerre o processo ou configure o MySQL para usar outra porta

## 📚 Recursos Adicionais

- **Documentação Oficial**: https://dev.mysql.com/doc/
- **MySQL Workbench Manual**: https://dev.mysql.com/doc/workbench/en/
- **Tutoriais**: https://www.mysqltutorial.org/

## 💡 Dicas de Segurança

1. **Use senhas fortes** para o usuário root
2. **Não compartilhe** suas credenciais
3. **Faça backups** regulares do banco de dados
4. **Mantenha o MySQL atualizado**

## 🔄 Fazer Backup do Banco de Dados

```bash
mysqldump -u root -p banco_questoes_estatistica > backup.sql
```

## 📥 Restaurar Backup

```bash
mysql -u root -p banco_questoes_estatistica < backup.sql
```

---

**Pronto!** Agora você tem o MySQL instalado e configurado no Windows. 🎉

Se tiver problemas, consulte a documentação oficial ou procure ajuda na comunidade.
