package com.smart.safais.service;

import com.smart.safais.model.Payment;
import com.smart.safais.model.Booking;
import com.smart.safais.repository.PaymentRepository;
import com.smart.safais.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public Payment createPayment(Payment payment) {
        // Validate that booking exists
        Optional<Booking> booking = bookingRepository.findById(payment.getBooking().getId());
        if (booking.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        payment.setStatus(Payment.Status.PENDING);
        return paymentRepository.save(payment);
    }

    public Payment processPayment(Long paymentId) {
        Optional<Payment> optionalPayment = paymentRepository.findById(paymentId);
        if (optionalPayment.isPresent()) {
            Payment payment = optionalPayment.get();
            payment.setStatus(Payment.Status.PAID);
            payment.setPaidAt(LocalDateTime.now());
            return paymentRepository.save(payment);
        }
        throw new RuntimeException("Payment not found with id: " + paymentId);
    }

    public Payment failPayment(Long paymentId) {
        Optional<Payment> optionalPayment = paymentRepository.findById(paymentId);
        if (optionalPayment.isPresent()) {
            Payment payment = optionalPayment.get();
            payment.setStatus(Payment.Status.FAILED);
            return paymentRepository.save(payment);
        }
        throw new RuntimeException("Payment not found with id: " + paymentId);
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }

    public List<Payment> getPaymentsByBookingId(Long bookingId) {
        // This would need a custom query in the repository
        return paymentRepository.findAll().stream()
                .filter(payment -> payment.getBooking().getId().equals(bookingId))
                .toList();
    }

    public List<Payment> getPaymentsByStatus(Payment.Status status) {
        // This would need a custom query in the repository
        return paymentRepository.findAll().stream()
                .filter(payment -> payment.getStatus() == status)
                .toList();
    }

    public Payment createPaymentForBooking(Long bookingId, String paymentMethod) {
        Optional<Booking> booking = bookingRepository.findById(bookingId);
        if (booking.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        // Get the route price from the booking
        Payment payment = Payment.builder()
                .booking(booking.get())
                .amount(booking.get().getRoute().getPrice())
                .paymentMethod(paymentMethod)
                .status(Payment.Status.PENDING)
                .build();

        return paymentRepository.save(payment);
    }
} 