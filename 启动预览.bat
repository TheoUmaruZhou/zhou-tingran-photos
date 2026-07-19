@echo off
chcp 65001 >nul
title 摄影网站预览
echo ================================
echo   摄影网站本地预览
echo ================================
echo.
echo 正在启动开发服务器...
echo.
echo 启动后请访问: http://localhost:3000
echo 按 Ctrl+C 可停止服务器
echo.
echo ================================
echo.
cd /d "%~dp0"
call npm run dev
pause