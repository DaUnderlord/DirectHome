@echo off
echo ========================================
echo  FIX GITHUB AUTHENTICATION
echo ========================================
echo.
echo This will clear old GitHub credentials
echo and allow you to enter the correct ones.
echo.
pause

echo.
echo Clearing GitHub credentials...
echo.

REM Clear GitHub credentials from Windows Credential Manager
for /f "tokens=1,2 delims= " %%G in ('cmdkey /list ^| findstr /i "github"') do cmdkey /delete:%%H

echo.
echo ========================================
echo  Credentials cleared!
echo ========================================
echo.
echo Now run this command to push:
echo.
echo   git push origin main
echo.
echo You will be prompted for your GitHub credentials.
echo Use your GitHub username and Personal Access Token.
echo.
echo To create a token:
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Select "repo" scope
echo 4. Copy the token
echo 5. Use it as your password when prompted
echo.
pause
