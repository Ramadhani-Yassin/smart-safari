package com.smart.safais.repository;

import com.smart.safais.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.smart.safais.model.User;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Find bookings by status
    List<Booking> findByStatus(Booking.Status status);
    
    // Find bookings by customer ID
    List<Booking> findByCustomerId(Long customerId);
    
    // Find bookings by driver ID
    List<Booking> findByDriverId(Long driverId);
    
    // Find pending bookings (no driver assigned)
    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' AND b.driver IS NULL")
    List<Booking> findPendingBookingsWithoutDriver();
    
    // Find bookings by status and driver
    List<Booking> findByStatusAndDriverId(Booking.Status status, Long driverId);

    @Query("UPDATE Booking b SET b.driver = :driver, b.status = :status WHERE b.id = :bookingId")
    @Modifying
    @Transactional
    void updateBookingDriverAndStatus(@Param("bookingId") Long bookingId, @Param("driver") User driver, @Param("status") Booking.Status status);

    @Query("UPDATE Booking b SET b.status = :status WHERE b.id = :bookingId")
    @Modifying
    @Transactional
    void updateBookingStatus(@Param("bookingId") Long bookingId, @Param("status") Booking.Status status);
} 