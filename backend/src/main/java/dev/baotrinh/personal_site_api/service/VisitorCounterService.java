package dev.baotrinh.personal_site_api.service;

import dev.baotrinh.personal_site_api.exception.VisitorCounterException;
import dev.baotrinh.personal_site_api.model.VisitorCount;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Expression;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;

import java.time.Instant;
//import java.util.Map;

/**
 * Service for managing visitor counts in DynamoDB.
 * Implements atomic counter operations with proper error handling.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VisitorCounterService {
    
    private final DynamoDbTable<VisitorCount> visitorCountTable;
    
    private static final String DEFAULT_COUNTER_KEY = "site-visits";
    
    /**
     * Atomically increments the visitor counter and returns the new count.
     * Uses DynamoDB atomic counter to ensure data consistency.
     *
     * @return the incremented visitor count
     * @throws RuntimeException if the DynamoDB operation fails
     */
    public Long incrementAndGetCount() {
        return incrementAndGetCount(DEFAULT_COUNTER_KEY);
    }
    
    /**
     * Atomically increments the visitor counter for a specific key and returns the new count.
     *
     * @param key the counter key (e.g., "site-visits", "page-visits", etc.)
     * @return the incremented visitor count
     * @throws RuntimeException if the DynamoDB operation fails
     */
    public Long incrementAndGetCount(String key) {
        try {
            log.info("Incrementing visitor count for key: {}", key);
            
            // First try to get the current item
            VisitorCount existingItem = visitorCountTable.getItem(r -> r.key(k -> k.partitionValue(key)));
            
            if (existingItem == null) {
                // Item doesn't exist, create it with count = 1
                VisitorCount newItem = VisitorCount.builder()
                        .pk(key)
                        .count(1L)
                        .lastUpdated(Instant.now())
                        .build();
                
                try {
                    // Use putItem with condition to ensure we don't overwrite existing items
                    Expression conditionExpression = Expression.builder()
                            .expression("attribute_not_exists(pk)")
                            .build();
                    
                    visitorCountTable.putItem(r -> r.item(newItem)
                            .conditionExpression(conditionExpression));
                    
                    log.info("Created new visitor count for key: {} with count: 1", key);
                    return 1L;
                    
                } catch (software.amazon.awssdk.services.dynamodb.model.ConditionalCheckFailedException e) {
                    // Item was created by another request, try to increment it
                    log.info("Item was created concurrently, retrying increment for key: {}", key);
                    return incrementExistingItem(key);
                }
            } else {
                // Item exists, increment it
                return incrementExistingItem(key);
            }
            
        } catch (DynamoDbException e) {
            log.error("Failed to increment visitor count for key: {} - Error: {}", key, e.getMessage(), e);
            throw new VisitorCounterException("Failed to increment visitor count", e);
        } catch (Exception e) {
            log.error("Unexpected error incrementing visitor count for key: {} - Error: {}", key, e.getMessage(), e);
            throw new VisitorCounterException("Unexpected error incrementing visitor count", e);
        }
    }
    
    /**
     * Helper method to increment an existing item using atomic update.
     */
    private Long incrementExistingItem(String key) {
        // Get current item first
        VisitorCount currentItem = visitorCountTable.getItem(r -> r.key(k -> k.partitionValue(key)));
        
        if (currentItem == null) {
            // Race condition - item was deleted, create new one
            VisitorCount newItem = VisitorCount.builder()
                    .pk(key)
                    .count(1L)
                    .lastUpdated(Instant.now())
                    .build();
            visitorCountTable.putItem(newItem);
            log.info("Created new visitor count for key: {} with count: 1", key);
            return 1L;
        }
        
        // Increment the count
        Long newCount = currentItem.getCount() + 1;
        VisitorCount updatedItem = VisitorCount.builder()
                .pk(key)
                .count(newCount)
                .lastUpdated(Instant.now())
                .build();
        
        // Update with optimistic locking using the current count as condition
        try {
            Expression conditionExpression = Expression.builder()
                    .expression("#count = :currentCount")
                    .putExpressionName("#count", "count")
                    .putExpressionValue(":currentCount", AttributeValue.builder().n(currentItem.getCount().toString()).build())
                    .build();
            
            visitorCountTable.putItem(r -> r.item(updatedItem)
                    .conditionExpression(conditionExpression));
            
            log.info("Successfully incremented visitor count for key: {} to {}", key, newCount);
            return newCount;
            
        } catch (software.amazon.awssdk.services.dynamodb.model.ConditionalCheckFailedException e) {
            // Count was updated by another request, retry
            log.info("Concurrent update detected for key: {}, retrying", key);
            return incrementExistingItem(key);
        }
    }
    
    /**
     * Gets the current visitor count without incrementing.
     *
     * @return the current visitor count, or 0 if the counter doesn't exist
     */
    public Long getCurrentCount() {
        return getCurrentCount(DEFAULT_COUNTER_KEY);
    }
    
    /**
     * Gets the current visitor count for a specific key without incrementing.
     *
     * @param key the counter key
     * @return the current visitor count, or 0 if the counter doesn't exist
     */
    public Long getCurrentCount(String key) {
        try {
            log.info("Getting current visitor count for key: {}", key);
            
            VisitorCount visitorCount = visitorCountTable.getItem(r -> r.key(k -> k.partitionValue(key)));
            
            Long count = visitorCount != null ? visitorCount.getCount() : 0L;
            log.info("Current visitor count for key: {} is {}", key, count);
            return count;
            
        } catch (DynamoDbException e) {
            log.error("Failed to get visitor count for key: {} - Error: {}", key, e.getMessage(), e);
            return 0L;
        } catch (Exception e) {
            log.error("Unexpected error getting visitor count for key: {} - Error: {}", key, e.getMessage(), e);
            return 0L;
        }
    }
}