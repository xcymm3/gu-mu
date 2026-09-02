@ECHO OFF
SETLOCAL
node "%~dp0node_modules\@playwright\test\cli.js" %*
EXIT /B %ERRORLEVEL%
