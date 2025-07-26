package com.smart.safais.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingRequestDto {
    private Long customerId;
    private Long routeId;
    private LocalDateTime scheduledTime;
} 