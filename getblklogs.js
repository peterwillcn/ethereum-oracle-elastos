"use strict";
const common = require("./common");

module.exports = async function (json_data, res) {
    try {
        console.log("Getting Sidechain Logs At Block Height: ");
        let blkheight = json_data["params"]["height"];
        console.log(blkheight);
        console.log("============================================================");
        let logs = null;
        if (parseInt(blkheight) > 7) {
            logs = await common.contract.getPastEvents(common.payloadReceived.name, {
                fromBlock: parseInt(blkheight) - 6,
                toBlock: parseInt(blkheight) - 6
            });
        }
        console.log("blockHeight",blkheight, "logs",logs)
        let result = new Array();
        let txhash = null;
        let txlog = null;
        let txreceipt;
        if (logs != null) {
            for (const log of logs) {
            console.log("log.address",log.address,"options.address",common.contract.options.address)
                if (log.address !== common.contract.options.address) {
                    continue;
                }
                if (txhash === null || txhash != log["transactionHash"]) {
                    txhash = log["transactionHash"];
                    txlog = {"txid": txhash.slice(2)};
                    txreceipt = await common.web3.eth.getTransactionReceipt(txhash)
                    console.log(txhash, txreceipt.status);
                    if (txreceipt.status) {
                        txlog["crosschainassets"] = new Array();
                        result.push(txlog);
                    }
                }

                if (txreceipt.status) {
                    let crosschainamount = String(common.retnum(log["returnValues"]["_crosschainamount"] / 1e18));
                  //let outputamount = String(common.retnum(log["returnValues"]["_amount"] / 1e18));
                    let outputamount = crosschainamount // for test
                    console.log("crosschainamount", crosschainamount);
                    console.log("outputamount", outputamount);
                    txlog["crosschainassets"].push({
                        "crosschainaddress": log["returnValues"]["_addr"],
                        "crosschainamount": crosschainamount,
                        "outputamount": outputamount
                    });
                }
            }
        }
        console.log("result", result);
        res.json({"result": result, "id": null, "error": null, "jsonrpc": "2.0"});
        console.log("============================================================\n\n\n\n");
        return;
    } catch (err) {
        common.reterr(err, res);
        return;
    }
}
