@echo off
chcp 65001 >nul
title 推送更新到GitHub
echo ================================
echo   推送更新到 GitHub
echo ================================
echo.
cd /d "%~dp0"

echo 正在检查更改...
echo.
git status
echo.

set /p commit_msg="请输入更新说明 (直接回车使用默认): "
if "%commit_msg%"=="" set commit_msg=更新网站内容

echo.
echo 正在添加更改...
git add .

echo.
echo 正在提交更改...
git commit -m "%commit_msg%"

echo.
echo 正在推送到 GitHub...
git push origin main

echo.
echo ================================
if %errorlevel%==0 (
    echo   推送成功！
    echo   网站将自动部署更新
) else (
    echo   推送失败，请检查网络
)
echo ================================
echo.
pause