package com.smart.safais.dto;

import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@Data
public class BookingRequestDto {
    private Long customerId;
    private Long routeId;
    
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime scheduledTime;
    
    public boolean isValid() {
        return customerId != null && routeId != null && scheduledTime != null;
    }
    
    @Override
    public String toString() {
        return "BookingRequestDto{" +
                "customerId=" + customerId +
                ", routeId=" + routeId +
                ", scheduledTime=" + scheduledTime +
                '}';
    }
} 