---
title: 'Bash script to configure raspberry pi for kiosk mode'
author: 'Michael Davis'
date: '2018-03-07'
published: true
# hero_image: ../static/.jpg
---

I wrote myself a script to provision the raspberry pi for kiosk mode. 

Be sure to change the password it sets.
Run it with an argument for the URL that it opens.

In the script I do some stuff with grep and sed to allow it to be run multiple times. I also explicitly set the keyboard to en-us and enable SSH for management.


## Run like this
`sudo ./setup.sh http://???`

```bash
#!/bin/bash
if [[ $UID != 0 ]]; then
    echo "Please run this script with sudo:"
    echo "sudo $0 $*"
    exit 1
fi
echo 'pi:r@aspberry' | chpasswd
update-rc.d ssh enable && invoke-rc.d ssh start
sed -i /etc/default/keyboard -e "s/^XKBLAYOUT.*/XKBLAYOUT=\"en\"/"
dpkg-reconfigure -f noninteractive keyboard-configuration

apt-get update -y
apt-get install x11-xserver-utils unclutter -y
grep -q -F '@chromium-browser --kiosk --no-first-run --disable-java --incognito' /home/pi/.config/lxsession/LXDE-pi/autostart || echo '@chromium-browser --kiosk --no-first-run --disable-java --incognito http://michaelwda.com' >> /home/pi/.config/lxsession/LXDE-pi/autostart

grep -q -F '@xset s noblank' /home/pi/.config/lxsession/LXDE-pi/autostart || echo '@xset s noblank' >> /home/pi/.config/lxsession/LXDE-pi/autostart
grep -q -F '@xset s off' /home/pi/.config/lxsession/LXDE-pi/autostart || echo '@xset s off' >> /home/pi/.config/lxsession/LXDE-pi/autostart
grep -q -F '@xset -dpms' /home/pi/.config/lxsession/LXDE-pi/autostart || echo '@xset -dpms' >> /home/pi/.config/lxsession/LXDE-pi/autostart
grep -q -F '@unclutter -idle 0.1 -root' /home/pi/.config/lxsession/LXDE-pi/autostart || echo '@unclutter -idle 0.1 -root' >> /home/pi/.config/lxsession/LXDE-pi/autostart

sed -i .config/lxsession/LXDE-pi/autostart -e "s|^@chromium-browser.*|@chromium-browser --kiosk --no-first-run --disable-java --incognito $1|"
#reboot
```