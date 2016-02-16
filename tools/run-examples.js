var fs = require('fs');
var path = require('path');
var process = require('process');
var child_process = require('child_process');

process.chdir(__dirname);

console.log('building examples');
child_process.execSync('node build-examples.js');


child_process.execSync('start http://localhost:8080/examples/');

console.log("starting server...");
process.chdir(path.join(__dirname, '..'));
child_process.execSync('coffee tools/web-server/web-server.coffee');
console.log("server started.");
