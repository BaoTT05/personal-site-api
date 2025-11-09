package dev.baotrinh.personal_site_api.exception;

/**
 * Custom exception for visitor counter operations.
 * Provides specific error handling for DynamoDB and business logic failures.
 */
public class VisitorCounterException extends RuntimeException {
    
    public VisitorCounterException(String message) {
        super(message);
    }
    
    public VisitorCounterException(String message, Throwable cause) {
        super(message, cause);
    }
}