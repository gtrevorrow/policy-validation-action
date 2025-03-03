#!/bin/bash

# Download the latest ANTLR 4.13.2 tool
if [ ! -f "antlr4.jar" ]; then
  echo "Downloading ANTLR 4.13.2..."
  curl -O https://www.antlr.org/download/antlr-4.13.2-complete.jar
  mv antlr-4.13.2-complete.jar antlr4.jar
fi

# Ensure antlr4ts is installed
if ! npm list antlr4ts > /dev/null 2>&1; then
  echo "Installing antlr4ts locally..."
  npm install --save antlr4ts antlr4ts-cli
fi

# Create output directory if it doesn't exist
mkdir -p src/generated

# Generate TypeScript parser with ANTLR 4.13.2
echo "Generating TypeScript parser from Policy.g4 using ANTLR 4.13.2..."
java -jar antlr4.jar -Dlanguage=TypeScript -visitor -o src/generated Policy.g4

# If you're using the npm package antlr4ts-cli, you can also use this command:
# echo "Using antlr4ts-cli to generate TypeScript parser..."
# npx antlr4ts -visitor -o src/generated Policy.g4

echo "Parser generation complete! TypeScript files are in src/generated/"
