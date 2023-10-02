#!/bin/bash

# Check if PROJECT_PATH is set
if [ -z "$PROJECT_PATH" ]; then
    echo "PROJECT_PATH environment variable is not set!"
    exit 1
fi

# Check if KRAKEN_DB_URL is set
if [ -z "$KRAKEN_DB_URL" ]; then
    echo "KRAKEN_DB_URL environment variable is not set!"
    exit 1
fi

# Define the URL of the file to be downloaded
URL="$KRAKEN_DB_URL"

# Define the directory where the file will be downloaded
DOWNLOAD_DIR="$PROJECT_PATH/data/downloads"

# Define the directory where the file will be extracted
EXTRACTION_DIR="$PROJECT_PATH/data/kraken_db"

# Create the download and extraction directories if they don't exist
mkdir -p "$DOWNLOAD_DIR" "$EXTRACTION_DIR"

# Change to the download directory
cd "$DOWNLOAD_DIR" || exit 1

# Download the file
echo "Downloading the file..."
FILENAME="$(basename "$URL")"

if curl -O "$URL"; then
    echo "Download completed."
else
    echo "Download failed. Exiting."
    exit 1
fi

# Extract the contents of the downloaded archive into the extraction directory
echo "Extracting the file..."
if tar --strip-components=1 -C "$EXTRACTION_DIR" -xzvf "$FILENAME"; then
    rm "$FILENAME"
    echo "Extraction completed."
else
    echo "Extraction failed. Exiting."
    exit 1
fi
