#!/bin/sh

NAT_IP=172.16.0.26
NAT_PORT=21636
function change_eth_rpc {
	echo $NAT_IP:$NAT_PORT
	sed -i -e "s/127.0.0.1\:20636/${NAT_IP}\:${NAT_PORT}/g" ./common.js ./deployctrt.js
}
change_eth_rpc

ORACLE_PORT=21632
function change_oracle_port {
	echo $ORACLE_PORT
  sed -i -e "s/20632/${ORACLE_PORT}/g" ./crosschain_oracle.js
}
#change_oracle_port

