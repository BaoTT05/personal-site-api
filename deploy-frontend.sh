#!/bin/bash

# Personal Site Frontend Deployment Script
# This script builds and deploys the React frontend to S3 and invalidates CloudFront cache

set -e

# Default values
STACK_NAME="personal-site"
REGION="us-east-1"
PROFILE=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to show usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -n, --stack-name NAME                 CloudFormation stack name [default: personal-site]"
    echo "  -r, --region REGION                   AWS region [default: us-east-1]"
    echo "  -p, --profile PROFILE                 AWS profile to use"
    echo "  -h, --help                            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0"
    echo "  $0 --stack-name my-personal-site --region us-west-2"
    echo ""
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -n|--stack-name)
            STACK_NAME="$2"
            shift 2
            ;;
        -r|--region)
            REGION="$2"
            shift 2
            ;;
        -p|--profile)
            PROFILE="$2"
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "Unknown option $1"
            usage
            ;;
    esac
done

# Set AWS profile if provided
if [[ -n "$PROFILE" ]]; then
    export AWS_PROFILE="$PROFILE"
    print_message $BLUE "Using AWS profile: $PROFILE"
fi

# Check if required tools are installed
if ! command -v aws &> /dev/null; then
    print_message $RED "Error: AWS CLI is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_message $RED "Error: npm is not installed"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    print_message $RED "Error: AWS credentials not configured"
    exit 1
fi

print_message $GREEN "Starting frontend deployment..."
print_message $BLUE "Configuration:"
print_message $BLUE "  Stack Name: $STACK_NAME"
print_message $BLUE "  Region: $REGION"
echo ""

# Get stack outputs
print_message $YELLOW "Getting infrastructure details..."
S3_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteS3Bucket`].OutputValue' \
    --output text 2>/dev/null || echo "")

CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text 2>/dev/null || echo "")

API_URL=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
    --output text 2>/dev/null || echo "")

WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text 2>/dev/null || echo "")

# Validate that we got the required outputs
if [[ -z "$S3_BUCKET" || "$S3_BUCKET" == "None" ]]; then
    print_message $RED "Error: Could not find S3 bucket from stack outputs. Make sure the stack is deployed correctly."
    exit 1
fi

if [[ -z "$CLOUDFRONT_ID" || "$CLOUDFRONT_ID" == "None" ]]; then
    print_message $RED "Error: Could not find CloudFront distribution ID from stack outputs."
    exit 1
fi

print_message $BLUE "Found infrastructure:"
print_message $BLUE "  S3 Bucket: $S3_BUCKET"
print_message $BLUE "  CloudFront ID: $CLOUDFRONT_ID"
print_message $BLUE "  API URL: ${API_URL:-'Not found'}"
print_message $BLUE "  Website URL: ${WEBSITE_URL:-'Not found'}"
echo ""

# Change to frontend directory
cd "$(dirname "$0")/frontend"

# Check if package.json exists
if [[ ! -f "package.json" ]]; then
    print_message $RED "Error: package.json not found in frontend directory"
    exit 1
fi

# Create or update .env file with API URL
if [[ -n "$API_URL" && "$API_URL" != "None" ]]; then
    print_message $YELLOW "Configuring environment variables..."
    echo "VITE_API_URL=$API_URL" > .env
    print_message $BLUE "Created .env with API URL: $API_URL"
fi

# Install dependencies
print_message $YELLOW "Installing frontend dependencies..."
npm install

# Build the frontend
print_message $YELLOW "Building frontend..."
npm run build

# Check if build was successful
if [[ ! -d "dist" ]]; then
    print_message $RED "Error: Build failed - dist directory not found"
    exit 1
fi

# Deploy to S3
print_message $YELLOW "Deploying to S3..."
aws s3 sync ./dist/ s3://"$S3_BUCKET"/ --delete --exact-timestamps

if [[ $? -eq 0 ]]; then
    print_message $GREEN "Frontend deployed to S3 successfully!"
    
    # Create CloudFront invalidation
    print_message $YELLOW "Creating CloudFront invalidation..."
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id "$CLOUDFRONT_ID" \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    
    if [[ $? -eq 0 ]]; then
        print_message $GREEN "CloudFront invalidation created: $INVALIDATION_ID"
        print_message $BLUE "Invalidation typically takes 1-5 minutes to complete."
        
        # Optionally wait for invalidation to complete
        read -p "Do you want to wait for the invalidation to complete? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_message $YELLOW "Waiting for invalidation to complete..."
            aws cloudfront wait invalidation-completed \
                --distribution-id "$CLOUDFRONT_ID" \
                --id "$INVALIDATION_ID"
            print_message $GREEN "Invalidation completed!"
        fi
    else
        print_message $YELLOW "Warning: CloudFront invalidation failed, but deployment was successful."
        print_message $YELLOW "You may need to wait for the cache to expire or create an invalidation manually."
    fi
    
    echo ""
    print_message $GREEN "Deployment completed successfully!"
    
    if [[ -n "$WEBSITE_URL" && "$WEBSITE_URL" != "None" ]]; then
        print_message $GREEN "Your website is available at: $WEBSITE_URL"
    fi
    
    print_message $BLUE "Files deployed:"
    aws s3 ls s3://"$S3_BUCKET"/ --recursive --human-readable
    
else
    print_message $RED "Frontend deployment to S3 failed!"
    exit 1
fi