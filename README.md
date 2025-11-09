# Personal Website with Visitor Counter

A modern, serverless personal website built with React frontend and Java Spring Cloud Function backend, deployed on AWS with automated CI/CD.

## 🏗️ Architecture

- **Frontend**: React + Vite → S3 + CloudFront
- **Backend**: Java 21 + Spring Cloud Function → AWS Lambda
- **Database**: DynamoDB
- **API**: API Gateway
- **CI/CD**: GitHub Actions
- **Infrastructure**: AWS SAM/CloudFormation

## Technology Stack

- **Java 21**: Latest LTS version with modern language features
- **Spring Boot 3.5.7**: Framework for dependency injection and configuration
- **Spring Cloud Function**: Serverless function runtime
- **AWS SDK v2**: DynamoDB Enhanced Client for type-safe operations
- **Maven**: Build and dependency management
- **Lombok**: Reducing boilerplate code

## Project Structure

```
src/
├── main/
│   ├── java/dev/baotrinh/personal_site_api/
│   │   ├── PersonalSiteApiApplication.java     # Main application class
│   │   ├── config/
│   │   │   └── DynamoDbConfig.java             # DynamoDB client configuration
│   │   ├── dto/
│   │   │   ├── VisitRequest.java               # Request DTO
│   │   │   └── VisitResponse.java              # Response DTO
│   │   ├── exception/
│   │   │   └── VisitorCounterException.java    # Custom exception
│   │   ├── function/
│   │   │   └── VisitorCounterFunction.java     # Main Lambda function
│   │   ├── model/
│   │   │   └── VisitorCount.java               # DynamoDB entity
│   │   └── service/
│   │       └── VisitorCounterService.java      # Business logic
│   └── resources/
│       ├── application.properties              # Base configuration
│       ├── application-dev.properties          # Development config
│       └── application-prod.properties         # Production config
├── test/
│   └── java/                                   # Unit and integration tests
template.yaml                                   # SAM CloudFormation template
samconfig.toml                                  # SAM deployment configuration
pom.xml                                         # Maven build configuration
```

## API Endpoints

### POST /visit

Increments the visitor counter and returns the current count.

**Request Body** (optional):
```json
{
  "page": "home",
  "userAgent": "Mozilla/5.0..."
}
```

**Response**:
```json
{
  "count": 42,
  "timestamp": "2023-11-07T10:15:30Z",
  "success": true
}
```

## Prerequisites

1. **Java 21** - Download from [Eclipse Temurin](https://adoptium.net/)
2. **Maven 3.8+** - For building the project
3. **AWS CLI** - Configured with appropriate credentials
4. **SAM CLI** - For local testing and deployment

```bash
# Install SAM CLI
pip install aws-sam-cli

# Verify installation
sam --version
```

## Local Development

### Building the Project

```bash
# Clean and compile
mvn clean compile

# Run tests
mvn test

# Build the deployment package
mvn clean package
```

### Local Testing with SAM

```bash
# Start the API locally (requires Docker)
sam local start-api

# Invoke function directly
sam local invoke VisitorCounterFunction -e events/test-event.json

# Generate test events
sam local generate-event apigateway aws-proxy > events/test-event.json
```

### Testing the API

```bash
# Test the visitor counter endpoint
curl -X POST http://localhost:3000/visit \
  -H "Content-Type: application/json" \
  -d '{"page": "home"}'
```

## Deployment

### Deploy to Development

```bash
# Build and deploy to dev environment
mvn clean package
sam deploy --config-env default

# Get the API Gateway URL
aws cloudformation describe-stacks \
  --stack-name personal-site-api-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
  --output text
```

### Deploy to Production

```bash
# Deploy to production environment
mvn clean package
sam deploy --config-env production
```

### Deployment Configuration

Update `samconfig.toml` with your specific values:

- Replace `CorsOrigin` in production config with your domain
- Adjust AWS region if needed
- Set appropriate S3 bucket for deployment artifacts

## Environment Variables

The Lambda function uses these environment variables:

- `VISITOR_COUNTS_TABLE`: DynamoDB table name (set by SAM template)
- `AWS_REGION`: AWS region (set by Lambda runtime)
- `SPRING_PROFILES_ACTIVE`: Active Spring profile (dev/prod)

## Security

### IAM Permissions

The Lambda function uses a minimal IAM role with these permissions:

- `dynamodb:GetItem` - Read visitor counts
- `dynamodb:PutItem` - Create new counter records
- `dynamodb:UpdateItem` - Atomically increment counters
- CloudWatch Logs permissions for function logging

### CORS Configuration

The API Gateway is configured with CORS headers:

- `Access-Control-Allow-Origin`: Configurable via SAM parameter
- `Access-Control-Allow-Methods`: POST, GET, OPTIONS
- `Access-Control-Allow-Headers`: Content-Type, Authorization, etc.

## Monitoring

### CloudWatch Integration

- **Logs**: Structured logging with correlation IDs
- **Metrics**: Lambda duration, errors, invocations
- **Alarms**: Error rate and duration monitoring (production only)

### Log Analysis

```bash
# View recent logs
aws logs tail /aws/lambda/personal-site-visitor-counter-dev --follow

# Search for errors
aws logs filter-log-events \
  --log-group-name /aws/lambda/personal-site-visitor-counter-dev \
  --filter-pattern "ERROR"
```

## Performance Considerations

### Lambda Optimizations

- **Java 21 Runtime**: Native compilation and startup optimizations
- **Memory Allocation**: 512MB for optimal price/performance
- **Timeout**: 30 seconds to handle DynamoDB retries
- **Environment Variables**: JAVA_TOOL_OPTIONS for faster startup

### DynamoDB Optimizations

- **On-Demand Billing**: Pay per request with automatic scaling
- **Atomic Operations**: ADD operation for race-condition-free increments
- **Point-in-Time Recovery**: Enabled for data protection

## Cost Optimization

- **DynamoDB On-Demand**: No pre-provisioned capacity
- **Lambda Free Tier**: 1M requests/month included
- **CloudWatch Logs**: 7-day retention in dev, 30-day in prod
- **No NAT Gateway**: Lambda runs in AWS VPC with internet access

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear Maven cache
   mvn dependency:purge-local-repository
   ```

2. **DynamoDB Access Denied**
   ```bash
   # Verify IAM role permissions
   aws iam get-role-policy --role-name PersonalSiteApiRole --policy-name DynamoDBPolicy
   ```

3. **CORS Errors**
   - Update `CorsOrigin` parameter in SAM template
   - Redeploy with `sam deploy`

4. **Cold Start Issues**
   - Monitor CloudWatch metrics for duration
   - Consider provisioned concurrency for production

### Debug Mode

Enable debug logging by setting environment variable:

```bash
# In SAM template or AWS Console
SPRING_PROFILES_ACTIVE: "dev"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.