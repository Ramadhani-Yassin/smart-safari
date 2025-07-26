package com.smart.safais.service;

import com.smart.safais.model.Trip;
import com.smart.safais.model.Booking;
import com.smart.safais.model.User;
import com.smart.safais.repository.TripRepository;
import com.smart.safais.repository.BookingRepository;
import com.smart.safais.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Optional<Trip> getTripById(Long id) {
        return tripRepository.findById(id);
    }

    public Trip createTrip(Trip trip) {
        // Validate that booking exists and is pending
        Optional<Booking> booking = bookingRepository.findById(trip.getBooking().getId());
        if (booking.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }
        if (booking.get().getStatus() != Booking.Status.PENDING) {
            throw new RuntimeException("Booking is not in pending status");
        }

        // Validate that driver exists and is a driver role
        Optional<User> driver = userRepository.findById(trip.getDriver().getId());
        if (driver.isEmpty() || !"DRIVER".equals(driver.get().getRole())) {
            throw new RuntimeException("Invalid driver or driver role");
        }

        // Update booking status to accepted
        booking.get().setStatus(Booking.Status.ACCEPTED);
        bookingRepository.save(booking.get());

        return tripRepository.save(trip);
    }

    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }

    public List<Trip> getTripsByDriverId(Long driverId) {
        // This would need a custom query in the repository
        return tripRepository.findAll().stream()
                .filter(trip -> trip.getDriver().getId().equals(driverId))
                .toList();
    }

    public Optional<Trip> getTripByBookingId(Long bookingId) {
        // This would need a custom query in the repository
        return tripRepository.findAll().stream()
                .filter(trip -> trip.getBooking().getId().equals(bookingId))
                .findFirst();
    }

    public Trip acceptBooking(Long bookingId, Long driverId) {
        // Check if booking exists and is pending
        Optional<Booking> booking = bookingRepository.findById(bookingId);
        if (booking.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }
        if (booking.get().getStatus() != Booking.Status.PENDING) {
            throw new RuntimeException("Booking is not in pending status");
        }

        // Check if driver exists and is a driver
        Optional<User> driver = userRepository.findById(driverId);
        if (driver.isEmpty() || !"DRIVER".equals(driver.get().getRole())) {
            throw new RuntimeException("Invalid driver or driver role");
        }

        // Create trip
        Trip trip = Trip.builder()
                .booking(booking.get())
                .driver(driver.get())
                .build();

        // Update booking status
        booking.get().setStatus(Booking.Status.ACCEPTED);
        bookingRepository.save(booking.get());

        return tripRepository.save(trip);
    }

    public void declineBooking(Long bookingId) {
        Optional<Booking> booking = bookingRepository.findById(bookingId);
        if (booking.isPresent()) {
            booking.get().setStatus(Booking.Status.DECLINED);
            bookingRepository.save(booking.get());
        }
    }
} 