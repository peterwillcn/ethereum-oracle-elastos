#!/bin/bash
export ADDR_NUM=300
for i in $(seq 1 $(( $ADDR_NUM ))); do
   ../node0/geth --password ./password --keystore ./keystore account new
done
