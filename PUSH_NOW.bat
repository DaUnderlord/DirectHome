@echo off
echo ========================================
echo  PUSH TO GITHUB
echo ========================================
echo.
echo Repository: https://github.com/DaUnderlord/DirectHome.git
echo Commit: 12a2e3f
echo Files: 52 files changed
echo.
echo ========================================
echo.

REM Change to the project directory
cd /d "%~dp0"

echo Checking git status...
git status --short
echo.

echo ========================================
echo  PUSHING TO GITHUB...
echo ========================================
echo.

REM Push to GitHub
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  SUCCESS! 
    echo ========================================
    echo.
    echo Your changes have been pushed to GitHub!
    echo.
    echo Check your repository:
    echo https://github.com/DaUnderlord/DirectHome
    echo.
    echo If you have Vercel/Netlify connected,
    echo your site will deploy automatically!
    echo.
) else (
    echo.
    echo ========================================
    echo  PUSH FAILED
    echo ========================================
    echo.
    echo Please try one of these solutions:
    echo.
    echo 1. Use GitHub Desktop (easiest)
    echo 2. Run FIX_GITHUB_AUTH.bat to clear credentials
    echo 3. See PUSH_TO_GITHUB_INSTRUCTIONS.md
    echo.
)

pause
