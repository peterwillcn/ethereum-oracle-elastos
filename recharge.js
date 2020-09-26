var fs = require('fs');
var path = require("path");
var Bagpipe = require('bagpipe')
var filePath = path.resolve('./keystore/');
var files = [];
walkSync(filePath, function(file, stat) {
    files.push(file);
});
wallets = readFileToArr(files)

Web3 = require("web3");
web3 = new Web3("http://127.0.0.1:2222");
from = {
    "address": "53781e106a2e3378083bdcede1874e5c2a7225f8",
    "crypto": {
        "cipher": "aes-128-ctr",
        "ciphertext": "bc53c1fcd6e31a6392ddc1777157ae961e636c202ed60fb5dda77244c5c4b6ff",
        "cipherparams": {
            "iv": "c5d1a7d86d0685aa4542d58c27ae7eb4"
        },
        "kdf": "scrypt",
        "kdfparams": {
            "dklen": 32,
            "n": 262144,
            "p": 1,
            "r": 8,
            "salt": "409429444dabb5664ba1314c93f0e1d7a1e994a307e7b43d3f6cc95850fbfa9f"
        },
        "mac": "4c37821c90d35118182c2d4a51356186482662bb945f0fcd33d3836749fe59c0"
    },
    "id": "39e7770e-4bc6-42f3-aa6a-c0ae7756b607",
    "version": 3
}

let index = 0;
var bagpipe = new Bagpipe(300);
acc = web3.eth.accounts.decrypt(from, "123");
for (let wallet of wallets) {
    to_wallet = web3.eth.accounts.decrypt(wallet, "123");
    console.log("wallet", to_wallet.address)
    bagpipe.push(function(to, acc, index) {
        web3.eth.getTransactionCount(acc.address).then((nonce) => {
            console.log("index", index, "nonce", nonce + index, "from", acc.address, "to:", to.address);
            create_tx(to, nonce + index, acc);
        });
    }, to_wallet, acc, index, function(console) {
        console.log(index)
    });
    index++;
    console.log(index)
    /*if(index > 6) {
      break;
    }*/
};

function create_tx(wallet, index, acc) {
    tx = {
        to: wallet.address,
        from: acc.address,
        gas: "3000000",
        gasPrice: "20000000000"
    }
    tx.value = 200000000000000000; // 2 ela
    tx.nonce = index;
    acc.signTransaction(tx).then((res) => {
        stx = res;
        console.log(stx.rawTransaction);
        web3.eth.sendSignedTransaction(stx.rawTransaction).then(console.log)
    });
};

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

function readFileToArr(fReadNames) {
    const arr = []
    for (let item of fReadNames) {
        const result = fs.readFileSync(item, 'utf-8');
        arr.push(result);
    }
    return arr;
}
