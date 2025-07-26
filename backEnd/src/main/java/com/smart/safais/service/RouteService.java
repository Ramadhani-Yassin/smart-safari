package com.smart.safais.service;

import com.smart.safais.model.Route;
import com.smart.safais.model.Booking;
import com.smart.safais.repository.RouteRepository;
import com.smart.safais.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;
    
    @Autowired
    private BookingRepository bookingRepository;

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Optional<Route> getRouteById(Long id) {
        return routeRepository.findById(id);
    }

    public Route createRoute(Route route) {
        return routeRepository.save(route);
    }

    public Route updateRoute(Long id, Route routeDetails) {
        Optional<Route> optionalRoute = routeRepository.findById(id);
        if (optionalRoute.isPresent()) {
            Route route = optionalRoute.get();
            route.setOrigin(routeDetails.getOrigin());
            route.setDestination(routeDetails.getDestination());
            route.setPrice(routeDetails.getPrice());
            return routeRepository.save(route);
        }
        throw new RuntimeException("Route not found with id: " + id);
    }

    public void deleteRoute(Long id) {
        // Check if route exists
        Optional<Route> routeOptional = routeRepository.findById(id);
        if (routeOptional.isEmpty()) {
            throw new RuntimeException("Route not found with id: " + id);
        }
        
        // Check if there are any bookings using this route
        List<Booking> bookingsWithRoute = bookingRepository.findByRouteId(id);
        if (!bookingsWithRoute.isEmpty()) {
            throw new RuntimeException("Route is in progress and cannot be deleted. There are " + bookingsWithRoute.size() + " active booking(s) using this route.");
        }
        
        // If no bookings exist, safe to delete
        routeRepository.deleteById(id);
    }

    public List<Route> getRoutesByOrigin(String origin) {
        // This would need a custom query in the repository
        return routeRepository.findAll().stream()
                .filter(route -> route.getOrigin().equalsIgnoreCase(origin))
                .toList();
    }

    public List<Route> getRoutesByDestination(String destination) {
        // This would need a custom query in the repository
        return routeRepository.findAll().stream()
                .filter(route -> route.getDestination().equalsIgnoreCase(destination))
                .toList();
    }
} 