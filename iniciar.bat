@echo off
echo ========================================
echo   Sistema de Banco de Questoes
echo ========================================
echo.

echo [1/3] Verificando dependencias...
if not exist "node_modules\" (
    echo Instalando dependencias do Node.js...
    call npm install
) else (
    echo Dependencias ja instaladas!
)

echo.
echo [2/3] Verificando configuracao...
if not exist ".env" (
    echo AVISO: Arquivo .env nao encontrado!
    echo Criando .env a partir do .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANTE: Edite o arquivo .env com suas credenciais do MySQL!
    echo Pressione qualquer tecla apos editar o .env...
    pause
)

echo.
echo [3/3] Iniciando servidor...
echo.
echo Servidor iniciando em http://localhost:3000
echo Pressione Ctrl+C para parar o servidor
echo.
call npm start
