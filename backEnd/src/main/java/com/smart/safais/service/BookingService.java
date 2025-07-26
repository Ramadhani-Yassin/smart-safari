package com.smart.safais.service;

import com.smart.safais.model.Booking;
import com.smart.safais.model.User;
import com.smart.safais.model.Route;
import com.smart.safais.repository.BookingRepository;
import com.smart.safais.repository.UserRepository;
import com.smart.safais.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RouteRepository routeRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public Booking createBooking(Booking booking) {
        // Validate that customer exists and is a customer role
        Optional<User> customer = userRepository.findById(booking.getCustomer().getId());
        if (customer.isEmpty() || !"CUSTOMER".equals(customer.get().getRole())) {
            throw new RuntimeException("Invalid customer or customer role");
        }

        // Validate that route exists
        Optional<Route> route = routeRepository.findById(booking.getRoute().getId());
        if (route.isEmpty()) {
            throw new RuntimeException("Route not found");
        }

        booking.setStatus(Booking.Status.PENDING);
        return bookingRepository.save(booking);
    }

    public Booking updateBookingStatus(Long id, Booking.Status status) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            booking.setStatus(status);
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found with id: " + id);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    public List<Booking> getBookingsByCustomerId(Long customerId) {
        // This would need a custom query in the repository
        return bookingRepository.findAll().stream()
                .filter(booking -> booking.getCustomer().getId().equals(customerId))
                .toList();
    }

    public List<Booking> getPendingBookings() {
        // This would need a custom query in the repository
        return bookingRepository.findAll().stream()
                .filter(booking -> booking.getStatus() == Booking.Status.PENDING)
                .toList();
    }

    public List<Booking> getBookingsByStatus(Booking.Status status) {
        // This would need a custom query in the repository
        return bookingRepository.findAll().stream()
                .filter(booking -> booking.getStatus() == status)
                .toList();
    }
} 