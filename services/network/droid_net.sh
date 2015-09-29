#!/bin/bash

echo "starting ppp tunnel"
adb ppp "shell: su -c 'pppd debug nodetach noauth noipdefault /dev/tty'" nodetach noauth noipdefault notty 10.0.0.1:10.0.0.2

#echo "setting default gateway"
#adb shell su -c 'ip route add default via 10.0.0.1'

#echo "setting dns resolver"
#adb shell su -c 'ndc resolver setnetdns ppp0 "" 8.8.8.8 8.8.8.4'

echo "Done."
