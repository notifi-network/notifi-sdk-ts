#!/bin/bash

# Constants
NOTIFI_DIRECTORY="$HOME/.notifi"
DEVELOPMENT_ENVIRONMENT_DIRECTORY="$NOTIFI_DIRECTORY/fusion-development"
CREDENTIALS_DIRECTORY="$NOTIFI_DIRECTORY/credentials"
FUSION_SOURCES_DIRECTORY="$DEVELOPMENT_ENVIRONMENT_DIRECTORY/fusion-sources"

DEV_AUTH_TOKEN_FILE="$CREDENTIALS_DIRECTORY/dev-token.txt"
DOCKER_COMPOSE_FILE_LOCATION="$DEVELOPMENT_ENVIRONMENT_DIRECTORY/docker-compose.yml"
DOCKER_COMPOSE_DOWNLOAD_URL="https://raw.githubusercontent.com/notifi-network/notifi-sdk-ts/jm/local-devenv-files/fusion-development-environment/docker-compose.yml" #TODO: update this once merged to main

# Step 1: Setup the required directories on host machine

# Array of directories to create
directories=($NOTIFI_DIRECTORY $DEVELOPMENT_ENVIRONMENT_DIRECTORY $CREDENTIALS_DIRECTORY $FUSION_SOURCES_DIRECTORY)

# Loop through the array of required directories and create if they don't exist
for dir in "${directories[@]}"; do
    if [[ ! -d $dir ]]; then
        mkdir -p "$dir"
    fi
done

if [[ ! -f $DEV_AUTH_TOKEN_FILE ]]; then        
    touch "$DEV_AUTH_TOKEN_FILE"
fi

# Step 2: Download the latest version of the docker-compose file
curl -fsSL -o $DOCKER_COMPOSE_FILE_LOCATION $DOCKER_COMPOSE_DOWNLOAD_URL

# Step 3: Export the required environment variables
export HOST_USER_ID=$(id -u)
export HOST_GROUP_ID=$(id -g)


# Step 4: Run the docker-compose file

# Stop existing containers, if any
docker-compose -f $DOCKER_COMPOSE_FILE_LOCATION down || true

# Run Docker Compose
docker-compose -f $DOCKER_COMPOSE_FILE_LOCATION up localfusion --build -d
docker-compose -f $DOCKER_COMPOSE_FILE_LOCATION up --build -d fusion-development

# Display the latest logs and then continue
docker-compose -f $DOCKER_COMPOSE_FILE_LOCATION logs fusion-development
# Attach to the container for interaction
docker attach fusion-development
