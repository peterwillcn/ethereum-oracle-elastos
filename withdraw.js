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
//console.log(readFileToArr(files))

wallets = readFileToArr(files)

Web3 = require("web3");
web3 = new Web3("http://127.0.0.1:2222");
contract = new web3.eth.Contract([{
    "constant": false,
    "inputs": [{
        "name": "_addr",
        "type": "string"
    }, {
        "name": "_amount",
        "type": "uint256"
    }, {
        "name": "_fee",
        "type": "uint256"
    }],
    "name": "receivePayload",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "_addr",
        "type": "string"
    }, {
        "indexed": false,
        "name": "_amount",
        "type": "uint256"
    }, {
        "indexed": false,
        "name": "_crosschainamount",
        "type": "uint256"
    }, {
        "indexed": true,
        "name": "_sender",
        "type": "address"
    }],
    "name": "PayloadReceived",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "_sender",
        "type": "address"
    }, {
        "indexed": false,
        "name": "_amount",
        "type": "uint256"
    }, {
        "indexed": true,
        "name": "_black",
        "type": "address"
    }],
    "name": "EtherDeposited",
    "type": "event"
}]);
contract.options.address = "0x491bC043672B9286fA02FA7e0d6A3E5A0384A31A";
cdata = contract.methods.receivePayload("EWRwrmBWpYFwnvAQffcP1vrPCS5sGTgWEB", 200000000000000, 100000000000000).encodeABI();

//wallets = [{"address":"53781e106a2e3378083bdcede1874e5c2a7225f8","crypto":{"cipher":"aes-128-ctr","ciphertext":"bc53c1fcd6e31a6392ddc1777157ae961e636c202ed60fb5dda77244c5c4b6ff","cipherparams":{"iv":"c5d1a7d86d0685aa4542d58c27ae7eb4"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"409429444dabb5664ba1314c93f0e1d7a1e994a307e7b43d3f6cc95850fbfa9f"},"mac":"4c37821c90d35118182c2d4a51356186482662bb945f0fcd33d3836749fe59c0"},"id":"39e7770e-4bc6-42f3-aa6a-c0ae7756b607","version":3}]

let index = 1;
var bagpipe = new Bagpipe(300);
for (let wallet of wallets) {
    console.log("build", index);
    acc = web3.eth.accounts.decrypt(wallet, "123");
    //web3.eth.getBalance(acc.address).then(console.log);
    bagpipe.push(function(acc, index) {
        web3.eth.getTransactionCount(acc.address).then((nonce) => {
            console.log("index", index, "nonce", nonce, "address", acc.address);
            create_tx(nonce, acc);

        });
    }, acc, index, function(console) {
        console.log(index)
    });
    index++;
};

function create_tx(index, acc) {
    console.log("create_tx", index, "address", acc.address)
    tx = {
        data: cdata,
        to: contract.options.address,
        from: acc.address,
        gas: "3000000",
        gasPrice: "20000000000"
    }
    tx.value = 200000000000000;
    tx.nonce = index;
    acc.signTransaction(tx).then((res) => {
        console.log("coming");
        stx = res;
        console.log("tx to: ", tx.to);
        console.log(stx.rawTransaction);
        web3.eth.sendSignedTransaction(stx.rawTransaction).then(console.log)
    });
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

function readFileToArr(fReadNames) {
    const arr = []
    for (let item of fReadNames) {
        const result = fs.readFileSync(item, 'utf-8');
        arr.push(result);
    }
    return arr;
}
