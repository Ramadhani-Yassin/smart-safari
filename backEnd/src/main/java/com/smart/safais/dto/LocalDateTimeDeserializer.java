package com.smart.safais.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class LocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {
    
    private static final DateTimeFormatter[] FORMATTERS = {
        DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"),
        DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"),
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"),
        DateTimeFormatter.ofPattern("yyyy-MM-dd")
    };

    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String dateStr = p.getText();
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        
        System.out.println("🔍 Attempting to parse date: " + dateStr);
        
        for (DateTimeFormatter formatter : FORMATTERS) {
            try {
                LocalDateTime result = LocalDateTime.parse(dateStr, formatter);
                System.out.println("✅ Successfully parsed date with formatter: " + formatter.toString());
                return result;
            } catch (DateTimeParseException e) {
                System.out.println("❌ Failed to parse with formatter " + formatter.toString() + ": " + e.getMessage());
                // Continue to next formatter
            }
        }
        
        System.err.println("❌ Could not parse date string: " + dateStr);
        throw new IOException("Could not parse date string: " + dateStr);
    }
} 