var process = require('process');
var child_process = require('child_process');

process.chdir(__dirname);

console.log('[0/4] compiling .coffee to .js');
child_process.execSync('coffee -bcm ../src/');

console.log('[1/4] concating .js files');
child_process.execSync('coffee concat-tool/concat-tool.coffee');

console.log('[2/4] minifying bu.js');
child_process.execSync('uglifyjs ../build/bu.js -mo ../build/bu.min.js');

console.log('[3/4] compiling .jade to .html');
child_process.execSync('jade -P ../examples/');

console.log('[4/4] build completed!');
