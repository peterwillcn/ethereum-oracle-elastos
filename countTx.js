Web3 = require("web3");
web3 = new Web3("http://127.0.0.1:2222");

num = web3.eth.getBlockNumber()


web3.eth.getBlockNumber().then(function(num) {
console.log("blockNumber", num)

var count = 5603
index = 1310

id = setInterval(function(){

	 web3.eth.getBlock(index).then(function(b){
	 	if (b.transactions.length > 0) {
	 		count += b.transactions.length
	 		console.log("height",b.number, "tx", b.transactions.length, "total:",count)
	 	}
	 	index = index + 1
	 })


	if (index >= num) {
		clearInterval(id)
	}


}, 20)





})







