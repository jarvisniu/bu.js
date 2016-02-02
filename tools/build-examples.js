/**
 * build the examples by compiling .coffee -> .js and .jade -> .html
 */

var process = require('process');
var child_process = require('child_process');

process.chdir(__dirname);

console.log('[0/3] compiling src/ .coffee to .js');
child_process.execSync('coffee -bcm ../src/');

console.log('[1/3] compiling examples/lib/ .coffee to .js');
child_process.execSync('coffee -bcm ../examples/lib/');

console.log('[2/3] compiling .jade to .html');
child_process.execSync('jade -P ../examples/');

console.log('[3/3] build completed!');
