@echo off

echo [0/4] compiling .coffee to .js
call coffee -bcm ../src/

echo [1/4] concating .js files
call coffee concat-tool\concat-tool.coffee

echo [2/4] minifying geom2d.js
call uglifyjs ../build/geom2d.js -mo ../build/geom2d.min.js

echo [3/4] compiling .jade to .html
call jade -P ../examples/

echo [4/4] build completed!
pause
