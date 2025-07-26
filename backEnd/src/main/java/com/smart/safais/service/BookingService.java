package com.smart.safais.service;

import com.smart.safais.dto.BookingRequestDto;
import com.smart.safais.model.Booking;
import com.smart.safais.model.User;
import com.smart.safais.model.Route;
import com.smart.safais.repository.BookingRepository;
import com.smart.safais.repository.UserRepository;
import com.smart.safais.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
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
        if (customer.isEmpty() || !"USER".equals(customer.get().getRole())) {
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

    public Booking createBookingFromDto(BookingRequestDto bookingRequest) {
        try {
            System.out.println("🔍 Validating booking request...");
            System.out.println("📋 Request data: " + bookingRequest);
            System.out.println("📅 Scheduled time type: " + (bookingRequest.getScheduledTime() != null ? bookingRequest.getScheduledTime().getClass().getName() : "null"));
            System.out.println("📅 Scheduled time value: " + bookingRequest.getScheduledTime());
            
            // Validate the entire request
            if (!bookingRequest.isValid()) {
                System.err.println("❌ Invalid booking request: " + bookingRequest);
                throw new RuntimeException("Invalid booking request - all fields are required");
            }
            
            // Validate that customer exists and is a customer role
            Optional<User> customer = userRepository.findById(bookingRequest.getCustomerId());
            if (customer.isEmpty()) {
                System.err.println("❌ Customer not found with ID: " + bookingRequest.getCustomerId());
                throw new RuntimeException("Customer not found with ID: " + bookingRequest.getCustomerId());
            }
            if (!"USER".equals(customer.get().getRole())) {
                System.err.println("❌ User with ID " + bookingRequest.getCustomerId() + " is not a customer (role: " + customer.get().getRole() + ")");
                throw new RuntimeException("User is not a customer (role: " + customer.get().getRole() + ")");
            }
            System.out.println("✅ Customer validated: " + customer.get().getName());

            // Validate that route exists
            Optional<Route> route = routeRepository.findById(bookingRequest.getRouteId());
            if (route.isEmpty()) {
                System.err.println("❌ Route not found with ID: " + bookingRequest.getRouteId());
                throw new RuntimeException("Route not found with ID: " + bookingRequest.getRouteId());
            }
            System.out.println("✅ Route validated: " + route.get().getOrigin() + " → " + route.get().getDestination());

            System.out.println("🔨 Building booking object...");
            System.out.println("📅 Scheduled time from request: " + bookingRequest.getScheduledTime());
            
            Booking booking = Booking.builder()
                    .customer(customer.get())
                    .route(route.get())
                    .scheduledTime(bookingRequest.getScheduledTime())
                    .status(Booking.Status.PENDING)
                    .build();

            System.out.println("💾 Saving booking to database...");
            Booking savedBooking = bookingRepository.save(booking);
            System.out.println("✅ Booking saved successfully with ID: " + savedBooking.getId());
            
            return savedBooking;
        } catch (Exception e) {
            System.err.println("❌ Error in createBookingFromDto: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
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
        return bookingRepository.findByCustomerId(customerId);
    }

    public List<Booking> getPendingBookings() {
        return bookingRepository.findByStatus(Booking.Status.PENDING);
    }

    public List<Booking> getBookingsByStatus(Booking.Status status) {
        return bookingRepository.findByStatus(status);
    }

    public List<Booking> getBookingsByStatus(String status) {
        try {
            Booking.Status bookingStatus = Booking.Status.valueOf(status.toUpperCase());
            return bookingRepository.findByStatus(bookingStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    public List<Booking> getBookingsForDriver(Long driverId) {
        return bookingRepository.findByDriverId(driverId);
    }

    public List<Booking> getPendingBookingsForDrivers() {
        return bookingRepository.findPendingBookingsWithoutDriver();
    }

    public Booking acceptBooking(Long bookingId, User driver) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            if (booking.getStatus() != Booking.Status.PENDING) {
                throw new RuntimeException("Booking is not in PENDING status");
            }
            
            try {
                // Use custom query to update only driver and status
                bookingRepository.updateBookingDriverAndStatus(bookingId, driver, Booking.Status.ON_WAY);
                
                // Return the updated booking
                return bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found after update"));
                    
            } catch (Exception e) {
                System.err.println("❌ Database error when accepting booking: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Database error when accepting booking: " + e.getMessage());
            }
        }
        throw new RuntimeException("Booking not found with id: " + bookingId);
    }

    public Booking declineBooking(Long bookingId, User driver) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            if (booking.getStatus() != Booking.Status.PENDING) {
                throw new RuntimeException("Booking is not in PENDING status");
            }
            
            try {
                // Use custom query to update only status (keep as PENDING)
                bookingRepository.updateBookingStatus(bookingId, Booking.Status.PENDING);
                
                // Return the updated booking
                return bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found after update"));
                    
            } catch (Exception e) {
                System.err.println("❌ Database error when declining booking: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Database error when declining booking: " + e.getMessage());
            }
        }
        throw new RuntimeException("Booking not found with id: " + bookingId);
    }

    public Booking updateBookingStatus(Long id, String status) {
        try {
            Booking.Status bookingStatus = Booking.Status.valueOf(status.toUpperCase());
            return updateBookingStatus(id, bookingStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }
} 