#!/bin/bash

# Personal Site Infrastructure Deployment Script
# This script deploys the full-stack infrastructure using AWS SAM

set -e

# Default values
STAGE="prod"
STACK_NAME="personal-site"
REGION="us-east-1"
DOMAIN_NAME=""
CREATE_HOSTED_ZONE="false"
EXISTING_HOSTED_ZONE_ID=""
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
    echo "  -s, --stage STAGE                     Deployment stage (dev, staging, prod) [default: prod]"
    echo "  -n, --stack-name NAME                 CloudFormation stack name [default: personal-site]"
    echo "  -r, --region REGION                   AWS region [default: us-east-1]"
    echo "  -d, --domain-name DOMAIN              Custom domain name (e.g., example.com)"
    echo "  -c, --create-hosted-zone              Create new Route 53 hosted zone"
    echo "  -z, --hosted-zone-id ID               Existing Route 53 hosted zone ID"
    echo "  -p, --profile PROFILE                 AWS profile to use"
    echo "  -h, --help                            Show this help message"
    echo ""
    echo "Examples:"
    echo "  # Deploy without custom domain"
    echo "  $0 --stage dev"
    echo ""
    echo "  # Deploy with new domain and hosted zone"
    echo "  $0 --stage prod --domain-name example.com --create-hosted-zone"
    echo ""
    echo "  # Deploy with existing hosted zone"
    echo "  $0 --stage prod --domain-name example.com --hosted-zone-id Z1234567890"
    echo ""
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -s|--stage)
            STAGE="$2"
            shift 2
            ;;
        -n|--stack-name)
            STACK_NAME="$2"
            shift 2
            ;;
        -r|--region)
            REGION="$2"
            shift 2
            ;;
        -d|--domain-name)
            DOMAIN_NAME="$2"
            shift 2
            ;;
        -c|--create-hosted-zone)
            CREATE_HOSTED_ZONE="true"
            shift
            ;;
        -z|--hosted-zone-id)
            EXISTING_HOSTED_ZONE_ID="$2"
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

# Validate inputs
if [[ "$STAGE" != "dev" && "$STAGE" != "staging" && "$STAGE" != "prod" ]]; then
    print_message $RED "Error: Stage must be one of: dev, staging, prod"
    exit 1
fi

if [[ -n "$DOMAIN_NAME" && "$CREATE_HOSTED_ZONE" == "false" && -z "$EXISTING_HOSTED_ZONE_ID" ]]; then
    print_message $RED "Error: When using a custom domain without creating a new hosted zone, you must provide --hosted-zone-id"
    exit 1
fi

# Set AWS profile if provided
if [[ -n "$PROFILE" ]]; then
    export AWS_PROFILE="$PROFILE"
    print_message $BLUE "Using AWS profile: $PROFILE"
fi

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    print_message $RED "Error: AWS CLI is not installed"
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    print_message $RED "Error: AWS SAM CLI is not installed"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    print_message $RED "Error: AWS credentials not configured"
    exit 1
fi

print_message $GREEN "Starting deployment..."
print_message $BLUE "Configuration:"
print_message $BLUE "  Stage: $STAGE"
print_message $BLUE "  Stack Name: $STACK_NAME"
print_message $BLUE "  Region: $REGION"
print_message $BLUE "  Domain Name: ${DOMAIN_NAME:-'None (using CloudFront domain)'}"
print_message $BLUE "  Create Hosted Zone: $CREATE_HOSTED_ZONE"
print_message $BLUE "  Existing Hosted Zone ID: ${EXISTING_HOSTED_ZONE_ID:-'None'}"
echo ""

# Change to infrastructure directory
cd "$(dirname "$0")/infra"

# Build the backend first
print_message $YELLOW "Building backend..."
cd ../backend
./mvnw clean package -DskipTests
cd ../infra

# Prepare SAM parameters
SAM_PARAMS="Stage=$STAGE"

if [[ -n "$DOMAIN_NAME" ]]; then
    SAM_PARAMS="$SAM_PARAMS DomainName=$DOMAIN_NAME"
fi

if [[ "$CREATE_HOSTED_ZONE" == "true" ]]; then
    SAM_PARAMS="$SAM_PARAMS CreateHostedZone=true"
fi

if [[ -n "$EXISTING_HOSTED_ZONE_ID" ]]; then
    SAM_PARAMS="$SAM_PARAMS ExistingHostedZoneId=$EXISTING_HOSTED_ZONE_ID"
fi

# Deploy with SAM
print_message $YELLOW "Deploying infrastructure..."
sam deploy \
    --template-file template.yaml \
    --stack-name "$STACK_NAME" \
    --capabilities CAPABILITY_NAMED_IAM \
    --region "$REGION" \
    --parameter-overrides $SAM_PARAMS \
    --tags Environment="$STAGE" Project="personal-site" \
    --confirm-changeset

if [[ $? -eq 0 ]]; then
    print_message $GREEN "Deployment completed successfully!"
    
    # Get stack outputs
    print_message $YELLOW "Getting stack outputs..."
    OUTPUTS=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs' \
        --output table 2>/dev/null || echo "")
    
    if [[ -n "$OUTPUTS" ]]; then
        echo ""
        print_message $GREEN "Stack Outputs:"
        echo "$OUTPUTS"
    fi
    
    # Get website URL
    WEBSITE_URL=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
        --output text 2>/dev/null || echo "")
    
    if [[ -n "$WEBSITE_URL" && "$WEBSITE_URL" != "None" ]]; then
        echo ""
        print_message $GREEN "Your website will be available at: $WEBSITE_URL"
        print_message $YELLOW "Note: It may take a few minutes for the CloudFront distribution to become fully available."
    fi
    
    # Get S3 bucket for frontend deployment
    S3_BUCKET=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`WebsiteS3Bucket`].OutputValue' \
        --output text 2>/dev/null || echo "")
    
    if [[ -n "$S3_BUCKET" && "$S3_BUCKET" != "None" ]]; then
        echo ""
        print_message $BLUE "To deploy your frontend, use:"
        print_message $BLUE "aws s3 sync ./frontend/dist/ s3://$S3_BUCKET/ --delete"
        
        # Get CloudFront distribution ID for cache invalidation
        CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
            --stack-name "$STACK_NAME" \
            --region "$REGION" \
            --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
            --output text 2>/dev/null || echo "")
        
        if [[ -n "$CLOUDFRONT_ID" && "$CLOUDFRONT_ID" != "None" ]]; then
            print_message $BLUE "aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths '/*'"
        fi
    fi
    
    # Show name servers if new hosted zone was created
    if [[ "$CREATE_HOSTED_ZONE" == "true" ]]; then
        NAME_SERVERS=$(aws cloudformation describe-stacks \
            --stack-name "$STACK_NAME" \
            --region "$REGION" \
            --query 'Stacks[0].Outputs[?OutputKey==`NameServers`].OutputValue' \
            --output text 2>/dev/null || echo "")
        
        if [[ -n "$NAME_SERVERS" && "$NAME_SERVERS" != "None" ]]; then
            echo ""
            print_message $YELLOW "IMPORTANT: Update your domain registrar with these name servers:"
            echo "$NAME_SERVERS" | tr ',' '\n' | sed 's/^ */  /'
        fi
    fi
    
else
    print_message $RED "Deployment failed!"
    exit 1
fi