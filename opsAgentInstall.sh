#!/bin/bash

# Add Ops Agent repository
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh

# Install Ops Agent
sudo apt-get update
sudo apt-get install -y ops-agent

# Clean up
rm add-google-cloud-ops-agent-repo.sh
