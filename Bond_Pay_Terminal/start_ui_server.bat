@echo off
title OffPay UI Local Server
echo ==============================================
echo   OffPay Terminal UI Local Web Server
echo ==============================================
echo.
echo Trying to start server using Node.js (npx)...
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Node.js found. Starting server on http://localhost:8080
    echo Opening OffPay Terminal in your browser...
    start http://localhost:8080/index.html
    echo.
    npx -y http-server -p 8080
    goto end
)

echo Node.js not found. Trying Python...
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Python found. Starting server on http://localhost:8000
    echo Opening OffPay Terminal in your browser...
    start http://localhost:8000/index.html
    echo.
    python -m http.server 8000
    goto end
)

echo.
echo ERROR: Neither Node.js nor Python is installed on your system!
echo Please open index.html directly in your browser or use Live Server.
echo.
pause

:end
