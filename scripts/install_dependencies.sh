#!/bin/bash

# Function to install AWS CLI
install_aws_cli() {
  echo "Installing AWS CLI..."
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
  fi
  unzip awscliv2.zip
  sudo ./aws/install
  rm -rf awscliv2.zip ./aws
  echo "AWS CLI Installed."
}

# Function to install Git
install_git() {
  echo "Installing Git..."
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    sudo apt-get update
    sudo apt-get install -y git
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    brew install git || echo "Assuming Git is already installed with XCode Command Line Tools."
  fi
}

# Function to install Docker
install_docker() {
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm get-docker.sh
}

# Function to install Docker Compose
install_docker_compose() {
  echo "Installing Docker Compose..."
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
}

# Main script execution starts here
echo "Checking and installing dependencies if needed..."

# Check and install AWS CLI if not exists
command -v aws >/dev/null 2>&1 || install_aws_cli

# Check and install Git if not exists
command -v git >/dev/null 2>&1 || install_git

# Check and install Docker if not exists
command -v docker >/dev/null 2>&1 || install_docker

# Check and install Docker Compose if not exists
command -v docker-compose >/dev/null 2>&1 || install_docker_compose

echo "Dependencies checked and installed if needed."
