package dev.baotrinh.personal_site_api;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.HashMap;
import java.util.Map;

public class VisitorCounterHandler implements RequestHandler<Map<String, Object>, Map<String, Object>> {
    
    private final DynamoDbClient dynamoDb = DynamoDbClient.create();
    private final String tableName = System.getenv().getOrDefault("VISITOR_COUNTS_TABLE", "VisitorCounts");
    
    @Override
    public Map<String, Object> handleRequest(Map<String, Object> event, Context context) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Increment visitor count atomically
            UpdateItemRequest request = UpdateItemRequest.builder()
                .tableName(tableName)
                .key(Map.of("pk", AttributeValue.builder().s("site-visits").build()))
                .updateExpression("ADD #count :inc")
                .expressionAttributeNames(Map.of("#count", "count"))
                .expressionAttributeValues(Map.of(":inc", AttributeValue.builder().n("1").build()))
                .returnValues(ReturnValue.UPDATED_NEW)
                .build();
            
            UpdateItemResponse result = dynamoDb.updateItem(request);
            String countStr = result.attributes().get("count").n();
            long count = Long.parseLong(countStr);
            
            // Success response with CORS
            response.put("statusCode", 200);
            response.put("body", "{\"count\":" + count + ",\"success\":true}");
            response.put("headers", Map.of(
                "Content-Type", "application/json",
                "Access-Control-Allow-Origin", "*",
                "Access-Control-Allow-Methods", "POST, OPTIONS",
                "Access-Control-Allow-Headers", "Content-Type"
            ));
            
        } catch (Exception e) {
            context.getLogger().log("Error: " + e.getMessage());
            
            // Error response with CORS
            response.put("statusCode", 500);
            response.put("body", "{\"success\":false}");
            response.put("headers", Map.of(
                "Content-Type", "application/json",
                "Access-Control-Allow-Origin", "*"
            ));
        }
        
        return response;
    }
}