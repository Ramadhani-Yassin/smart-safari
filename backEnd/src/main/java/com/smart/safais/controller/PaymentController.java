package com.smart.safais.controller;

import com.smart.safais.dto.ApiResponse;
import com.smart.safais.model.Payment;
import com.smart.safais.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Payment>>> getAllPayments() {
        try {
            List<Payment> payments = paymentService.getAllPayments();
            return ResponseEntity.ok(new ApiResponse<>(true, "Payments retrieved successfully", payments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving payments: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Payment>> getPaymentById(@PathVariable Long id) {
        try {
            Optional<Payment> payment = paymentService.getPaymentById(id);
            if (payment.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(true, "Payment retrieved successfully", payment.get()));
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Payment not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving payment: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Payment>> createPayment(@RequestBody Payment payment) {
        try {
            Payment createdPayment = paymentService.createPayment(payment);
            return ResponseEntity.ok(new ApiResponse<>(true, "Payment created successfully", createdPayment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error creating payment: " + e.getMessage(), null));
        }
    }

    @PostMapping("/process/{id}")
    public ResponseEntity<ApiResponse<Payment>> processPayment(@PathVariable Long id) {
        try {
            Payment processedPayment = paymentService.processPayment(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Payment processed successfully", processedPayment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error processing payment: " + e.getMessage(), null));
        }
    }

    @PostMapping("/fail/{id}")
    public ResponseEntity<ApiResponse<Payment>> failPayment(@PathVariable Long id) {
        try {
            Payment failedPayment = paymentService.failPayment(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Payment marked as failed", failedPayment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error failing payment: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deletePayment(@PathVariable Long id) {
        try {
            paymentService.deletePayment(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Payment deleted successfully", "Payment with id " + id + " has been deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error deleting payment: " + e.getMessage(), null));
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<List<Payment>>> getPaymentsByBookingId(@PathVariable Long bookingId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByBookingId(bookingId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Booking payments retrieved successfully", payments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving booking payments: " + e.getMessage(), null));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<Payment>>> getPaymentsByStatus(@PathVariable Payment.Status status) {
        try {
            List<Payment> payments = paymentService.getPaymentsByStatus(status);
            return ResponseEntity.ok(new ApiResponse<>(true, "Payments retrieved successfully", payments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving payments: " + e.getMessage(), null));
        }
    }

    @PostMapping("/create-for-booking")
    public ResponseEntity<ApiResponse<Payment>> createPaymentForBooking(@RequestParam Long bookingId, @RequestParam String paymentMethod) {
        try {
            Payment payment = paymentService.createPaymentForBooking(bookingId, paymentMethod);
            return ResponseEntity.ok(new ApiResponse<>(true, "Payment created for booking successfully", payment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error creating payment for booking: " + e.getMessage(), null));
        }
    }
} 