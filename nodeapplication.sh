#!/bin/bash



# Copy your systemd service file to /etc/systemd/system
sudo cp /opt/csye6225/nodeapplication.service /etc/systemd/system/

# Reload systemd to pick up the changes
sudo systemctl daemon-reload

sudo systemctl start nodeapplication.service

# Enable your service to start on boot
sudo systemctl enable nodeapplication.service



sudo systemctl status nodeapplication.service
