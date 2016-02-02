/**
 * build the examples by compiling .coffee -> .js and .jade -> .html
 */

var process = require('process');
var child_process = require('child_process');

process.chdir(__dirname);

console.log('[0/2] compiling .coffee to .js');
child_process.execSync('coffee -bcm ../src/');

console.log('[1/2] compiling .jade to .html');
child_process.execSync('jade -P ../examples/');

console.log('[2/2] build completed!');
