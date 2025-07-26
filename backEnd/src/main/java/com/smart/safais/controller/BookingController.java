package com.smart.safais.controller;

import com.smart.safais.dto.ApiResponse;
import com.smart.safais.dto.BookingRequestDto;
import com.smart.safais.model.Booking;
import com.smart.safais.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import com.smart.safais.model.User;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings() {
        try {
            List<Booking> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(new ApiResponse<>(true, "Bookings retrieved successfully", bookings));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving bookings: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(@PathVariable Long id) {
        try {
            Optional<Booking> booking = bookingService.getBookingById(id);
            if (booking.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(true, "Booking retrieved successfully", booking.get()));
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Booking not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving booking: " + e.getMessage(), null));
        }
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<ApiResponse<Booking>> createBooking(@RequestBody BookingRequestDto bookingRequest) {
        try {
            Booking createdBooking = bookingService.createBookingFromDto(bookingRequest);
            return ResponseEntity.ok(new ApiResponse<>(true, "Booking created successfully", createdBooking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error creating booking: " + e.getMessage(), null));
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByCustomerId(@PathVariable Long customerId) {
        try {
            List<Booking> bookings = bookingService.getBookingsByCustomerId(customerId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Customer bookings retrieved successfully", bookings));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving customer bookings: " + e.getMessage(), null));
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<Booking>>> getPendingBookings() {
        try {
            List<Booking> bookings = bookingService.getPendingBookings();
            return ResponseEntity.ok(new ApiResponse<>(true, "Pending bookings retrieved successfully", bookings));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving pending bookings: " + e.getMessage(), null));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<ApiResponse<String>> testEndpoint() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking controller is working", "OK"));
    }

    @PostMapping("/test/create-pending")
    public ResponseEntity<ApiResponse<Booking>> createTestPendingBooking() {
        try {
            // Create a test booking with PENDING status
            BookingRequestDto testBooking = new BookingRequestDto();
            testBooking.setCustomerId(1L); // Assuming customer with ID 1 exists
            testBooking.setRouteId(1L);    // Assuming route with ID 1 exists
            testBooking.setScheduledTime(LocalDateTime.now().plusHours(1)); // 1 hour from now
            
            Booking booking = bookingService.createBookingFromDto(testBooking);
            return ResponseEntity.ok(new ApiResponse<>(true, "Test pending booking created", booking));
        } catch (Exception e) {
            System.err.println("❌ Error creating test booking: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error creating test booking: " + e.getMessage(), null));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByStatus(@PathVariable String status) {
        try {
            System.out.println("🔍 Fetching bookings with status: " + status);
            List<Booking> bookings = bookingService.getBookingsByStatus(status);
            System.out.println("✅ Found " + bookings.size() + " bookings with status: " + status);
            return ResponseEntity.ok(new ApiResponse<>(true, "Bookings retrieved successfully", bookings));
        } catch (Exception e) {
            System.err.println("❌ Error retrieving bookings: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving bookings: " + e.getMessage(), null));
        }
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsForDriver(@PathVariable Long driverId) {
        try {
            List<Booking> bookings = bookingService.getBookingsForDriver(driverId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Driver bookings retrieved successfully", bookings));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving driver bookings: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{bookingId}/accept")
    public ResponseEntity<ApiResponse<Booking>> acceptBooking(@PathVariable Long bookingId, @RequestBody User driver) {
        try {
            System.out.println("🔍 Accepting booking ID: " + bookingId);
            System.out.println("🚗 Driver data: " + driver);
            
            if (driver == null) {
                System.err.println("❌ Driver object is null");
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Driver data is required", null));
            }
            
            if (driver.getId() == null) {
                System.err.println("❌ Driver ID is null");
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Driver ID is required", null));
            }
            
            Booking booking = bookingService.acceptBooking(bookingId, driver);
            System.out.println("✅ Booking accepted successfully: " + booking.getId());
            return ResponseEntity.ok(new ApiResponse<>(true, "Booking accepted successfully", booking));
        } catch (Exception e) {
            System.err.println("❌ Error accepting booking: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error accepting booking: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{bookingId}/decline")
    public ResponseEntity<ApiResponse<Booking>> declineBooking(@PathVariable Long bookingId, @RequestBody User driver) {
        try {
            System.out.println("🔍 Declining booking ID: " + bookingId);
            System.out.println("🚗 Driver data: " + driver);
            
            if (driver == null) {
                System.err.println("❌ Driver object is null");
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Driver data is required", null));
            }
            
            Booking booking = bookingService.declineBooking(bookingId, driver);
            System.out.println("✅ Booking declined successfully: " + booking.getId());
            return ResponseEntity.ok(new ApiResponse<>(true, "Booking declined successfully", booking));
        } catch (Exception e) {
            System.err.println("❌ Error declining booking: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error declining booking: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Booking>> updateBookingStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Booking booking = bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(new ApiResponse<>(true, "Booking status updated successfully", booking));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error updating booking status: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Booking deleted successfully", "Booking with id " + id + " has been deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error deleting booking: " + e.getMessage(), null));
        }
    }
} 