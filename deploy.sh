#!/bin/bash

# Personal Site API Deployment Script
# This script builds and deploys the serverless backend to AWS

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Default values
ENVIRONMENT="dev"
SKIP_BUILD=false
SKIP_TESTS=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -e, --environment ENV    Deploy to environment (dev|prod) [default: dev]"
            echo "      --skip-build         Skip Maven build"
            echo "      --skip-tests         Skip running tests"
            echo "  -h, --help               Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Validate environment
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    print_error "Environment must be 'dev' or 'prod'"
    exit 1
fi

print_status "Starting deployment to $ENVIRONMENT environment..."

# Check prerequisites
print_status "Checking prerequisites..."

# Check Java
if ! command -v java &> /dev/null; then
    print_error "Java is not installed or not in PATH"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
if [[ "$JAVA_VERSION" -lt "21" ]]; then
    print_error "Java 21 or higher is required. Found version: $JAVA_VERSION"
    exit 1
fi

# Check Maven
if ! command -v mvn &> /dev/null; then
    print_error "Maven is not installed or not in PATH"
    exit 1
fi

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed or not in PATH"
    exit 1
fi

# Check SAM CLI
if ! command -v sam &> /dev/null; then
    print_error "SAM CLI is not installed or not in PATH"
    exit 1
fi

print_success "All prerequisites are met"

# Build the project
if [[ "$SKIP_BUILD" == false ]]; then
    print_status "Building the project..."
    
    if [[ "$SKIP_TESTS" == false ]]; then
        print_status "Running tests..."
        mvn clean test
        print_success "Tests passed"
    fi
    
    print_status "Packaging application..."
    mvn clean package -DskipTests=$SKIP_TESTS
    print_success "Application packaged successfully"
else
    print_warning "Skipping build (--skip-build flag provided)"
fi

# Check if JAR file exists
JAR_FILE="target/personal-site-api-0.0.1-SNAPSHOT-aws.jar"
if [[ ! -f "$JAR_FILE" ]]; then
    print_error "JAR file not found: $JAR_FILE"
    print_error "Please run 'mvn clean package' first or remove --skip-build flag"
    exit 1
fi

# Deploy with SAM
print_status "Deploying to AWS ($ENVIRONMENT)..."

if [[ "$ENVIRONMENT" == "prod" ]]; then
    SAM_CONFIG_ENV="production"
else
    SAM_CONFIG_ENV="default"
fi

sam deploy --config-env "$SAM_CONFIG_ENV"

if [[ $? -eq 0 ]]; then
    print_success "Deployment completed successfully!"
    
    # Get the API Gateway URL
    STACK_NAME="personal-site-api-$ENVIRONMENT"
    API_URL=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
        --output text 2>/dev/null)
    
    if [[ -n "$API_URL" ]]; then
        echo ""
        print_success "API Gateway URL: $API_URL"
        print_status "Test the endpoint with:"
        echo "  curl -X POST $API_URL/visit -H \"Content-Type: application/json\" -d '{\"page\": \"home\"}'"
    fi
    
    # Show CloudWatch logs info
    echo ""
    print_status "Monitor logs with:"
    echo "  aws logs tail /aws/lambda/personal-site-visitor-counter-$ENVIRONMENT --follow"
    
else
    print_error "Deployment failed!"
    exit 1
fi