#!/bin/bash

echo "You need tmux installed to run these log commands"

while true; do
    read -p "Do you wish to install Tmux?" yn
    case $yn in
        [Yy]* ) apt install tmux; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

tmux new -d -s 'frontend' docker logs app-frontend-1 --follow 

tmux new -d -s 'backend' docker logs app-backend-1 --follow
tmux ls