var fs = require('fs');
var path = require('path');

require('process').chdir(__dirname);

del('../build/*.js');
del('../src/*.js');
del('../src/*.js.map');
del('../examples/*.html');

// Delete files in folder and subfolders
function del(filePath) {
    console.log("cleaning: " + filePath);
    var lastSlashIndex = filePath.lastIndexOf('/');
    var folderRoot = filePath.substring(0, lastSlashIndex);
    var fileStr = filePath.substring(lastSlashIndex + 1);
    var fileRegex = new RegExp(fileStr.replace('*', '\w*') + '$');

    var folderList = [folderRoot];
    while (folderList.length > 0) {
        var folder = folderList.shift();
        var childList = fs.readdirSync(folder);
        for (var i in childList) {
            if (!childList.hasOwnProperty(i)) continue;
            var child = path.join(folder, childList[i]);
            if (fs.statSync(child).isFile()) {
                if (fileRegex.test(child)) fs.unlinkSync(child);
            } else {
                folderList.push(child);
            }
        }
    }
}
