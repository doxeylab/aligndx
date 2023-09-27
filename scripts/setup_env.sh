#!/bin/bash

# Check if .env file exists
if [ -f .env ]; then
    echo ".env file already exists. Aborting."
    exit 1
fi

# Define a function to generate a random string
generate_random_string() {
    tr -dc A-Za-z0-9 </dev/urandom | head -c 32 
}

# Process each line in .env.template to replace placeholders with random strings
while IFS= read -r line; do
    if [[ "$line" == *"replace_with_your_api_key"* ]]; then
        line="${line//replace_with_your_api_key/$(generate_random_string)}"
    fi
    echo "$line" >> .env
done < .env.template

echo ".env file has been created and placeholders have been replaced with random strings. Please edit with actual values."
