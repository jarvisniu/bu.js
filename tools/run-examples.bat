@echo off
echo building examples...
call node build-examples.js
cd ..
start http://localhost:8080/examples/
echo starting server...
call coffee tools/web-server/web-server.coffee
pause
