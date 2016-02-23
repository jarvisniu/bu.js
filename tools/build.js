/**
 * build the bu.coffee, bu.js and bu.min.js
 */

var process = require('process');
var child_process = require('child_process');

process.chdir(__dirname);

console.log('[0/3] concating .coffee files');
child_process.execSync('coffee concat-tool/concat-tool.coffee');

console.log('[1/3] compiling bu.coffee to bu.js');
child_process.execSync('coffee -cm ../build/bu.coffee');

console.log('[2/3] minifying bu.js');
child_process.execSync('uglifyjs ../build/bu.js -mo ../build/bu.min.js');

console.log('[3/3] build completed!');
