var fs = require('fs');
var path = require("path");

var filePath = path.resolve('./keystore/');

var files = [];
walkSync(filePath, function(file, stat) {
  //console.log(file);
  files.push(file);
});
console.log(files);
console.log(readFileToArr(files))

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    var filePath = path.join(currentDirPath, name);
    var stat = fs.statSync(filePath);
    if (stat.isFile()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}

function readFileToArr(fReadNames) {
    const arr = []
    for (let item of fReadNames) {
        const result = fs.readFileSync(item, 'utf-8');
        arr.push(result);
    }
    return arr;
}

