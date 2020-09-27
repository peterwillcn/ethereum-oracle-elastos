var fs = require('fs');
var Bagpipe = require('bagpipe')

Web3 = require("web3");
web3 = new Web3("http://127.0.0.1:2222");

var wallets = readOneFileToArr("./wallet.csv")

var index = 0;
var priv = wallets[0][0]
var from = wallets[0][1]
var bagpipe = new Bagpipe(300);
for (let wallet of wallets) {
    to = wallet[1]

    console.log("build", index, to, priv);
    bagpipe.push(function(to, index, priv) {
        web3.eth.getTransactionCount(from).then((nonce) => {
            console.log("index", index, "nonce", nonce, "address", to);
            create_tx(nonce + index, to, priv);
        });
    }, to, index, priv, function(console) {});
    index++;
    /*if (index > 6) {
          break;
    }*/
};

function create_tx(index, to, priv) {
    console.log("create_tx", index, "to", to, "from", from, "priv", priv)
    tx = {
        to: to,
        from: from,
        gas: "3000000",
        gasPrice: "20000000000"
    }
    tx.value = 1000000000000000000; // 1 ela
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
