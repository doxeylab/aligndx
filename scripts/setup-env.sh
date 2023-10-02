#!/bin/bash

# Check if .env file exists
if [ -f .env ]; then
    echo ".env file already exists. Aborting."
    exit 1
fi

generate_random_string() {
    LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32
}

project_path="$(pwd)/backend"

# Process each line in .env.template to replace placeholders with random strings
while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ "$line" == *"replace_with_your_api_key"* ]]; then
        line="${line//replace_with_your_api_key/$(generate_random_string)}"
    elif [[ "$line" == "PROJECT_PATH="* ]]; then
        line="PROJECT_PATH=$project_path"
    elif [[ "$line" == "REDIS_PASSWORD="* ]]; then
        echo "Please enter your Redis Password:"
        read user_input < /dev/tty
        line="REDIS_PASSWORD=$user_input"
    elif [[ "$line" == "POSTGRES_USER="* ]]; then
        echo "Please enter your Postgres User:"
        read user_input < /dev/tty
        line="POSTGRES_USER=$user_input"
    elif [[ "$line" == "POSTGRES_PASSWORD="* ]]; then
        echo "Please enter your Postgres Password:"
        read user_input < /dev/tty
        line="POSTGRES_PASSWORD=$user_input"
    elif [[ "$line" == "POSTGRES_DB="* ]]; then
        echo "Please enter your Postgres DB Name:"
        read user_input < /dev/tty
        line="POSTGRES_DB=$user_input"
    elif [[ "$line" == "PIPELINES_REPO="* ]]; then
        echo "Please enter your Pipelines Repo:"
        read user_input < /dev/tty
        line="PIPELINES_REPO=$user_input"
    elif [[ "$line" == "PIPELINES_REPO_TOKEN="* ]]; then
        echo "Please enter your Pipelines Repo Token:"
        read user_input < /dev/tty
        line="PIPELINES_REPO_TOKEN=$user_input"
    elif [[ "$line" == "KRAKEN_DB_URL="* ]]; then
        echo "Please enter your Kraken DB URL:"
        read user_input < /dev/tty
        line="KRAKEN_DB_URL=$user_input"
    fi
    echo "$line" >> .env
done < .env.template

echo ".env file has been created and placeholders have been replaced with random strings. Please edit with actual values."
