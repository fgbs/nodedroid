#!/bin/bash

if [ $(ip addr show dev ppp0|wc -l) -eq 0 ]; then
    echo "starting ppp tunnel"
    sudo adb ppp "shell: su -c 'pppd debug nodetach noauth noipdefault /dev/tty'" nodetach noauth noipdefault notty 10.0.0.1:10.0.0.2
    RES=$?

    if [ $RES -eq 1 ]; then
        exit 1
    fi

    sleep 3

    if [ $RES -eq 0 ]; then
        echo "setting default gateway"
        adb shell su -c 'ip route add default via 10.0.0.1'

        echo "setting dns resolver"
        adb shell su -c 'ndc resolver setnetdns ppp0 "" 8.8.8.8 8.8.8.4'
    fi
else
    echo "already running"
    exit 0
fi


