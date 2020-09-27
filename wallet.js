var fs = require('fs');
var path = require("path");
var Bagpipe = require('bagpipe')
var filePath = path.resolve('./keystore/');
var files = [];
walkSync(filePath, function(file, stat) {
    //console.log(file);
    files.push(file);
});
//console.log(files);
//console.log(readAllFileToArr(files))

wallets = readAllFileToArr(files)

Web3 = require("web3");
web3 = new Web3("http://127.0.0.1:2222");

//wallets = [{"address":"53781e106a2e3378083bdcede1874e5c2a7225f8","crypto":{"cipher":"aes-128-ctr","ciphertext":"bc53c1fcd6e31a6392ddc1777157ae961e636c202ed60fb5dda77244c5c4b6ff","cipherparams":{"iv":"c5d1a7d86d0685aa4542d58c27ae7eb4"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"409429444dabb5664ba1314c93f0e1d7a1e994a307e7b43d3f6cc95850fbfa9f"},"mac":"4c37821c90d35118182c2d4a51356186482662bb945f0fcd33d3836749fe59c0"},"id":"39e7770e-4bc6-42f3-aa6a-c0ae7756b607","version":3}]

let index = 1;
var bagpipe = new Bagpipe(300);
for (let wallet of wallets) {
    console.log("build", index);
    acc = web3.eth.accounts.decrypt(wallet, "123");
    // web3.eth.getBalance(acc.address).then(console.log);
    bagpipe.push(function(acc, index) {
        fs.appendFile(__dirname + '/wallet.csv', acc.privateKey + "," + acc.address + "\n", function() {
            //console.log('ok');
        });
    }, acc, function(console) {
        //console.log(index)
    });
    index++;
    /*if(index > 2) {
        break;
      }*/
};

// read test
var arr = readOneFileToArr("/wallet.csv")
console.log(arr[0][0], arr[0][1])
console.log(arr[1][0], arr[1][1])

function readOneFileToArr(filePath) {
    const table = []
    var rows = new Array();
    const result = fs.readFileSync(filePath, 'utf-8');
    rows = result.split("\n");
    for (var i = 0; i < rows.length; i++) {
        table.push(rows[i].split(","));
    }
    return table;
}

function readAllFileToArr(fReadNames) {
    const arr = []
    for (let item of fReadNames) {
        const result = fs.readFileSync(item, 'utf-8');
        arr.push(result);
    }
    return arr;
}

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function(name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}
