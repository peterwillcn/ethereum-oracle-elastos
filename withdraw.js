var fs = require('fs');
var Bagpipe = require('bagpipe')
var wallets = readOneFileToArr("./wallet.csv")

//var arguments = process.argv.splice(2);
//let startIndex = arguments[0];
//console.log("startIndex", startIndex)
// start = startIndex * 10
// if (start >= wallets.length) {
//     return
// }
// end = startIndex * 10 + 10
// if (end >= wallets.length) {
//     end = wallets.length - 1
// }
// console.log("start", start, "end", end)
// wallets=wallets.slice(startIndex * 10, startIndex * 10 + 10)

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

//acc = web3.eth.accounts.decrypt(wallet, "123");
//web3.eth.getBalance(acc.address).then(console.log);
//wallets = [{"address":"53781e106a2e3378083bdcede1874e5c2a7225f8","crypto":{"cipher":"aes-128-ctr","ciphertext":"bc53c1fcd6e31a6392ddc1777157ae961e636c202ed60fb5dda77244c5c4b6ff","cipherparams":{"iv":"c5d1a7d86d0685aa4542d58c27ae7eb4"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"409429444dabb5664ba1314c93f0e1d7a1e994a307e7b43d3f6cc95850fbfa9f"},"mac":"4c37821c90d35118182c2d4a51356186482662bb945f0fcd33d3836749fe59c0"},"id":"39e7770e-4bc6-42f3-aa6a-c0ae7756b607","version":3}]

let index = 1;
var bagpipe = new Bagpipe(300);
for (let wallet of wallets) {
    acc = wallet[1]
    priv = wallet[0]
    console.log("build", index, acc, priv);

    bagpipe.push(function(acc, index, priv) {
        web3.eth.getTransactionCount(acc).then((nonce) => {
            console.log("index", index, "nonce", nonce, "address", acc);
            create_tx(nonce, acc, priv);
        });
    }, acc, index, priv, function(console) {});

    index++;
    // if (index > 6) {
    //     break;
    // }
};

function create_tx(index, acc, priv) {
    console.log("create_tx", index, "address", acc, "priv", priv)
    tx = {
        data: cdata,
        to: contract.options.address,
        from: acc,
        gas: "3000000",
        gasPrice: "20000000000"
    }
    tx.value = 200000000000000;
    tx.nonce = index;

    web3.eth.accounts.signTransaction(tx, priv).then((stx) => {
        console.log(stx.rawTransaction);
        web3.eth.sendSignedTransaction(stx.rawTransaction).then(console.log)
    });
}

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
