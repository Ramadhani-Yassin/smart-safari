package com.smart.safais.controller;

import com.smart.safais.dto.ApiResponse;
import com.smart.safais.model.Trip;
import com.smart.safais.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*")
public class TripController {

    @Autowired
    private TripService tripService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Trip>>> getAllTrips() {
        try {
            List<Trip> trips = tripService.getAllTrips();
            return ResponseEntity.ok(new ApiResponse<>(true, "Trips retrieved successfully", trips));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving trips: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Trip>> getTripById(@PathVariable Long id) {
        try {
            Optional<Trip> trip = tripService.getTripById(id);
            if (trip.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(true, "Trip retrieved successfully", trip.get()));
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Trip not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving trip: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Trip>> createTrip(@RequestBody Trip trip) {
        try {
            Trip createdTrip = tripService.createTrip(trip);
            return ResponseEntity.ok(new ApiResponse<>(true, "Trip created successfully", createdTrip));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error creating trip: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTrip(@PathVariable Long id) {
        try {
            tripService.deleteTrip(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Trip deleted successfully", "Trip with id " + id + " has been deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error deleting trip: " + e.getMessage(), null));
        }
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<ApiResponse<List<Trip>>> getTripsByDriverId(@PathVariable Long driverId) {
        try {
            List<Trip> trips = tripService.getTripsByDriverId(driverId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Driver trips retrieved successfully", trips));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving driver trips: " + e.getMessage(), null));
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<Trip>> getTripByBookingId(@PathVariable Long bookingId) {
        try {
            Optional<Trip> trip = tripService.getTripByBookingId(bookingId);
            if (trip.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(true, "Trip retrieved successfully", trip.get()));
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Trip not found for this booking", null));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving trip: " + e.getMessage(), null));
        }
    }

    @PostMapping("/accept")
    public ResponseEntity<ApiResponse<Trip>> acceptBooking(@RequestParam Long bookingId, @RequestParam Long driverId) {
        try {
            Trip trip = tripService.acceptBooking(bookingId, driverId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Booking accepted successfully", trip));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error accepting booking: " + e.getMessage(), null));
        }
    }

    @PostMapping("/decline")
    public ResponseEntity<ApiResponse<String>> declineBooking(@RequestParam Long bookingId) {
        try {
            tripService.declineBooking(bookingId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Booking declined successfully", "Booking with id " + bookingId + " has been declined"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error declining booking: " + e.getMessage(), null));
        }
    }
} 