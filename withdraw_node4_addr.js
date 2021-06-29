Web3 = require("web3");
web3 = new Web3("http://172.16.0.29:21636");

//const ks = require("./ks");

contract = new web3.eth.Contract([{"constant":false,"inputs":[{"name":"_addr","type":"string"},{"name":"_amount","type":"uint256"},{"name":"_fee","type":"uint256"}],"name":"receivePayload","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_addr","type":"string"},{"indexed":false,"name":"_amount","type":"uint256"},{"indexed":false,"name":"_crosschainamount","type":"uint256"},{"indexed":true,"name":"_sender","type":"address"}],"name":"PayloadReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_sender","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"},{"indexed":true,"name":"_black","type":"address"}],"name":"EtherDeposited","type":"event"}]);
contract.options.address = "0x7ef2a32a207A2273B2fFC591f06806FF111E76d4"; //提现合约地址 testnet 是 0x491bC043672B9286fA02FA7e0d6A3E5A0384A31A

//提现账号
acc = web3.eth.accounts.decrypt({"address":"9b170f914ef3541cd29ee672a11c56d4b96b4b6f","crypto":{"cipher":"aes-128-ctr","ciphertext":"380e3f43a3224c4e9139a9195d43e79e05f508e52990f06e7aa83a1191561228","cipherparams":{"iv":"eebc49903849fc4ef01e311acd12400d"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"20f7eaae4ac9e2cec28bcad986a81c3f21ec4f6bd0ac944bf53270e881fa71b4"},"mac":"5a75a05fabeda7939e22ee8dae6d75403bb6ae957410c30f82a96f8030cfc027"},"id":"5d639e49-f5ea-4805-a110-c9a33015c0de","version":3},"123");
//{"address":"53781e106a2e3378083bdcede1874e5c2a7225f8","crypto":{"cipher":"aes-128-ctr","ciphertext":"bc53c1fcd6e31a6392ddc1777157ae961e636c202ed60fb5dda77244c5c4b6ff","cipherparams":{"iv":"c5d1a7d86d0685aa4542d58c27ae7eb4"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"409429444dabb5664ba1314c93f0e1d7a1e994a307e7b43d3f6cc95850fbfa9f"},"mac":"4c37821c90d35118182c2d4a51356186482662bb945f0fcd33d3836749fe59c0"},"id":"39e7770e-4bc6-42f3-aa6a-c0ae7756b607","version":3}, "123");  

//const acc = web3.eth.accounts.decrypt(ks.kstore, ks.kpass);

withDrawValue = web3.utils.toWei("0.03"), //提现金额

cdata  = contract.methods.receivePayload("EbwLYyYZ3doXvdoTZu1apyL7F7kDbpzYNt", withDrawValue, 100000000000000).encodeABI(); //参数 1. 主链地址 2，提现金额 3，手续费

tx = {data: cdata, to: contract.options.address, from: acc.address, gas: "2000000", gasPrice: "1000000000"}
tx.value = withDrawValue;

acc.signTransaction(tx).then((res)=>{
	console.log("coming");
	stx = res;
	console.log(stx.rawTransaction);
	web3.eth.sendSignedTransaction(stx.rawTransaction).then(console.log)
});