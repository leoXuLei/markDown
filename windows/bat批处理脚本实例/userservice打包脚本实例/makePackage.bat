::> 关闭回显：关闭命令行窗口中的命令回显，使得脚本运行时不会显示每一行命令。
@echo off




@REM  【0】执行log.js 脚本，获取提交信息并写入到 changeLog.txt 文件中。执行打包命令"yarn distWithElectronFalse"，然后再把changeLog.txt 文件复制到 build 目录。
::> 将传递给批处理脚本的第一个参数显示在控制台上
:: > ��պ�д��
echo ************************
echo * start dist          *
echo ************************
echo command_argv=%1
:: /kִ������󲻹ر�dos��/c �ر�
::> 执行 log.js 脚本, 并将第一个参数%1传递给 log.js
cmd /c "node ./log.js %1"
cd .\userservice_web
::> 运行命令
cmd /c "yarn distWithElectronFalse"
::> 将 changeLog.txt 文件复制到 build 目录。
copy .\changeLog.txt .\build\

@REM 【1】创建打包文件夹，将文件（ changeLog.txt 文件、build文件夹）复制到打包文件夹下。
cd ..
::> 生成一个包含当前日期的文件夹名称UserServicePackage_YYYYMMDD
set fileName=UserServicePackage_%date:~0,4%%date:~5,2%%date:~8,2%
echo %fileName%
::> 如果该文件夹已存在，则删除它。重新创建。
if exist %fileName% (rd /s/q "%fileName%")
md %fileName%
::> 复制文件到打包文件夹：
copy .\userservice_web\changeLog.txt .\%fileName%\
xcopy /s .\userservice_web\build\* .\%fileName%\userservice_supos-win32-x64\


@REM 【2】切换到 userservice_web 目录，运行 yarn build 命令，然后将 out 目录下的所有文件复制到打包文件夹中。
echo .
echo ************************
echo * start build           *
echo ************************

cd .\userservice_web
cmd /c "yarn build"
xcopy /s .\out\* ..\%fileName%\

echo ************************
echo * success package      *
echo ************************

pause