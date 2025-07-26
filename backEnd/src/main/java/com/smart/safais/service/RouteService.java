package com.smart.safais.service;

import com.smart.safais.model.Route;
import com.smart.safais.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

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