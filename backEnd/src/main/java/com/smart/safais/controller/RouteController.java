package com.smart.safais.controller;

import com.smart.safais.dto.ApiResponse;
import com.smart.safais.model.Route;
import com.smart.safais.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Route>>> getAllRoutes() {
        try {
            List<Route> routes = routeService.getAllRoutes();
            return ResponseEntity.ok(new ApiResponse<>(true, "Routes retrieved successfully", routes));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving routes: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Route>> getRouteById(@PathVariable Long id) {
        try {
            Optional<Route> route = routeService.getRouteById(id);
            if (route.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(true, "Route retrieved successfully", route.get()));
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Route not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving route: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Route>> createRoute(@RequestBody Route route) {
        try {
            Route createdRoute = routeService.createRoute(route);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route created successfully", createdRoute));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error creating route: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Route>> updateRoute(@PathVariable Long id, @RequestBody Route routeDetails) {
        try {
            Route updatedRoute = routeService.updateRoute(id, routeDetails);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route updated successfully", updatedRoute));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error updating route: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRoute(@PathVariable Long id) {
        try {
            routeService.deleteRoute(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route deleted successfully", "Route with id " + id + " has been deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error deleting route: " + e.getMessage(), null));
        }
    }

    @GetMapping("/origin/{origin}")
    public ResponseEntity<ApiResponse<List<Route>>> getRoutesByOrigin(@PathVariable String origin) {
        try {
            List<Route> routes = routeService.getRoutesByOrigin(origin);
            return ResponseEntity.ok(new ApiResponse<>(true, "Routes retrieved successfully", routes));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving routes: " + e.getMessage(), null));
        }
    }

    @GetMapping("/destination/{destination}")
    public ResponseEntity<ApiResponse<List<Route>>> getRoutesByDestination(@PathVariable String destination) {
        try {
            List<Route> routes = routeService.getRoutesByDestination(destination);
            return ResponseEntity.ok(new ApiResponse<>(true, "Routes retrieved successfully", routes));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving routes: " + e.getMessage(), null));
        }
    }
} 