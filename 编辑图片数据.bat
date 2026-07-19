@echo off
chcp 65001 >nul
title 编辑图片数据
echo ================================
echo   编辑图片数据
echo ================================
echo.
echo 即将用记事本打开图片数据文件
echo.
echo 文件位置: src\data.ts
echo.
echo 编辑完成后:
echo 1. 保存文件
echo 2. 运行"启动预览.bat"查看效果
echo 3. 运行"推送更新.bat"发布更改
echo.
echo ================================
echo.
cd /d "%~dp0"
notepad "src\data.ts"
pause