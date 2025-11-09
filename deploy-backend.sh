#!/bin/bash

# Personal Site Backend Deployment Script
# Works with reorganized project structure

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}[INFO]${NC} Deploying backend from reorganized structure..."

# Build the backend
echo -e "${BLUE}[INFO]${NC} Building backend..."
cd backend
mvn clean package
cd ..

echo -e "${GREEN}[SUCCESS]${NC} Backend built successfully!"

# Deploy infrastructure
echo -e "${BLUE}[INFO]${NC} Deploying infrastructure..."
cd infra
sam deploy --resolve-s3
cd ..

echo -e "${GREEN}[SUCCESS]${NC} Backend deployment complete!"

# Get API URL
STACK_NAME="personal-site-api-dev"
API_URL=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
    --output text 2>/dev/null)

if [[ -n "$API_URL" ]]; then
    echo ""
    echo -e "${GREEN}[SUCCESS]${NC} API Gateway URL: $API_URL"
    echo -e "${BLUE}[INFO]${NC} Test with:"
    echo "  curl -X POST $API_URL/visit -H \"Content-Type: application/json\" -d '{\"page\": \"home\"}'"
fi