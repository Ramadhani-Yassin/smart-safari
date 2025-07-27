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
    
    // Find all bookings ordered by creation date (newest first)
    @Query("SELECT b FROM Booking b ORDER BY b.createdAt DESC")
    List<Booking> findAllOrderByCreatedAtDesc();
    
    // Find bookings by status ordered by creation date (newest first)
    @Query("SELECT b FROM Booking b WHERE b.status = :status ORDER BY b.createdAt DESC")
    List<Booking> findByStatusOrderByCreatedAtDesc(@Param("status") Booking.Status status);
    
    // Find bookings by customer ID ordered by creation date (newest first)
    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId ORDER BY b.createdAt DESC")
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(@Param("customerId") Long customerId);
    
    // Find bookings by driver ID ordered by creation date (newest first)
    @Query("SELECT b FROM Booking b WHERE b.driver.id = :driverId ORDER BY b.createdAt DESC")
    List<Booking> findByDriverIdOrderByCreatedAtDesc(@Param("driverId") Long driverId);
    
    // Find bookings by route ID ordered by creation date (newest first)
    @Query("SELECT b FROM Booking b WHERE b.route.id = :routeId ORDER BY b.createdAt DESC")
    List<Booking> findByRouteIdOrderByCreatedAtDesc(@Param("routeId") Long routeId);
    
    // Find pending bookings (no driver assigned) ordered by creation date (newest first)
    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' AND b.driver IS NULL ORDER BY b.createdAt DESC")
    List<Booking> findPendingBookingsWithoutDriverOrderByCreatedAtDesc();
    
    // Find bookings by status and driver ordered by creation date (newest first)
    @Query("SELECT b FROM Booking b WHERE b.status = :status AND b.driver.id = :driverId ORDER BY b.createdAt DESC")
    List<Booking> findByStatusAndDriverIdOrderByCreatedAtDesc(@Param("status") Booking.Status status, @Param("driverId") Long driverId);

    // Legacy methods for backward compatibility (keeping them but they're deprecated)
    @Deprecated
    List<Booking> findByStatus(Booking.Status status);
    
    @Deprecated
    List<Booking> findByCustomerId(Long customerId);
    
    @Deprecated
    List<Booking> findByDriverId(Long driverId);
    
    @Deprecated
    List<Booking> findByRouteId(Long routeId);
    
    @Deprecated
    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' AND b.driver IS NULL")
    List<Booking> findPendingBookingsWithoutDriver();
    
    @Deprecated
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