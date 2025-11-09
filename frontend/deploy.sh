#!/bin/bash

# Frontend deployment script for AWS S3 + CloudFront
# Run this after setting up your S3 bucket and CloudFront distribution

set -e

echo "Building React app for production..."
npm run build

echo "Deploying to S3..."
# Update with your actual S3 bucket name
S3_BUCKET="your-website-bucket-name"
aws s3 sync dist/ s3://$S3_BUCKET --delete

echo "Invalidating CloudFront cache..."
# Update with your actual CloudFront distribution ID
CLOUDFRONT_DISTRIBUTION_ID="your-distribution-id"
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"

echo "Deployment complete!"
echo "Your website should be live at your custom domain shortly."