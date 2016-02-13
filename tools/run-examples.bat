@echo off
echo building examples...
call node build-examples.js
cd ..
start http://localhost:8080/examples/
echo starting server...
call coffee tools/node-server/node-server.coffee
pause
