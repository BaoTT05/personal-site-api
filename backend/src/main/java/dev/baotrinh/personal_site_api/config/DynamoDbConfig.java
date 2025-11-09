package dev.baotrinh.personal_site_api.config;

import dev.baotrinh.personal_site_api.model.VisitorCount;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

/**
 * DynamoDB configuration for the visitor counter Lambda function.
 * Configures the DynamoDB client with proper AWS SDK settings for Lambda runtime.
 */
@Slf4j
@Configuration
public class DynamoDbConfig {
    
    @Bean
    public DynamoDbClient dynamoDbClient() {
        log.info("Creating DynamoDB client with default credentials provider");
        return DynamoDbClient.builder()
                .credentialsProvider(DefaultCredentialsProvider.create())
                .region(Region.of(System.getenv().getOrDefault("AWS_REGION", "us-east-1")))
                .build();
    }
    
    @Bean
    public DynamoDbEnhancedClient dynamoDbEnhancedClient(DynamoDbClient dynamoDbClient) {
        log.info("Creating DynamoDB enhanced client");
        return DynamoDbEnhancedClient.builder()
                .dynamoDbClient(dynamoDbClient)
                .build();
    }
    
    @Bean
    public DynamoDbTable<VisitorCount> visitorCountTable(DynamoDbEnhancedClient enhancedClient) {
        String tableName = System.getenv().getOrDefault("VISITOR_COUNTS_TABLE", "VisitorCounts");
        log.info("Creating DynamoDB table reference for table: {}", tableName);
        return enhancedClient.table(tableName, TableSchema.fromBean(VisitorCount.class));
    }
}