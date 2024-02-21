#!/bin/bash

sudo cp /opt/csye6225/nodeapplication.service /etc/systemd/system/

# Reload systemd to pick up the changes
sudo systemctl daemon-reload

sudo systemctl start nodeapplication.service


sudo systemctl enable nodeapplication.service



sudo systemctl status nodeapplication.service
