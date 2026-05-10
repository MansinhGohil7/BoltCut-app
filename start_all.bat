@echo off
echo ==================================================
echo Starting Bolt Cut (Client-Side Only App)
echo ==================================================
echo.
echo Note: This application processes videos entirely in the browser using WebAssembly.
echo There is no backend server required!
echo.
echo Starting Frontend Development Server...
start cmd.exe /k "npm run dev"

echo Server is starting in a new window...
