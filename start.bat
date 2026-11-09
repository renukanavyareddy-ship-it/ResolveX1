@echo off
title ResolveX - Smart Complaint Redressal Launcher
color 0B

echo ===============================================================================
echo        ResolveX - Smart Complaint Reporting & Resolution System
echo ===============================================================================
echo.
echo [1/4] Verifying Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not added to PATH.
    echo Please download and install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
node -v
echo [OK] Node.js detected.
echo.

echo [2/4] Verifying backend dependencies...
if not exist "%~dp0backend\node_modules" (
    echo Dependencies not found. Installing backend packages...
    cd /d "%~dp0backend"
    call npm install
    cd /d "%~dp0"
) else (
    echo [OK] Backend packages installed.
)
echo.

echo [3/4] Verifying frontend dependencies...
if not exist "%~dp0frontend\node_modules" (
    echo Dependencies not found. Installing frontend packages...
    cd /d "%~dp0frontend"
    call npm install
    cd /d "%~dp0"
) else (
    echo [OK] Frontend packages installed.
)
echo.

echo [4/4] Launching Servers...
echo.
echo Starting Backend API Server on port 5001...
start "ResolveX Backend Server [Port 5001]" cmd /k "cd /d "%~dp0backend" && title ResolveX Backend (Port 5001) && npm start"

echo Waiting for backend initialization...
timeout /t 3 /nobreak >nul

echo Starting Frontend Vite Server on port 5173...
start "ResolveX Frontend Client [Port 5173]" cmd /k "cd /d "%~dp0frontend" && title ResolveX Frontend (Port 5173) && npm run dev"

echo Waiting for frontend initialization...
timeout /t 2 /nobreak >nul

echo Opening browser at http://localhost:5173...
start http://localhost:5173

echo.
echo ===============================================================================
echo                    ResolveX is now running!
echo ===============================================================================
echo.
echo   Frontend Web Application:  http://localhost:5173
echo   Backend REST API:          http://localhost:5001/api/health
echo.
echo   DEMO CREDENTIALS:
echo   ===========================================================================
echo   [Administrator]
echo     Email:    admin@resolvex.com
echo     Password: Admin@123
echo.
echo   [Citizen User]
echo     Email:    rahul.sharma@example.com
echo     Password: User@123
echo   ===========================================================================
echo.
echo   To stop the servers, simply close the two opened command prompt windows
echo   or run 'stop.bat'.
echo ===============================================================================
echo.
pause
