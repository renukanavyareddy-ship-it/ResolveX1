@echo off
title ResolveX - Server Shutdown
color 0E

echo ===============================================================================
echo              ResolveX - Stopping Development Servers
echo ===============================================================================
echo.

echo Searching for processes listening on port 5001 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001" ^| findstr "LISTENING"') do (
    echo Stopping process PID %%a on port 5001...
    taskkill /f /pid %%a >nul 2>&1
)

echo Searching for processes listening on port 5173 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Stopping process PID %%a on port 5173...
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo [OK] All ResolveX servers have been stopped.
echo ===============================================================================
echo.
pause
