import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Route, RouteResponse } from '../model/Route';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private apiUrl = 'http://localhost:8080/api/routes';

  constructor(private http: HttpClient) { }

  getAllRoutes(): Observable<RouteResponse> {
    return this.http.get<RouteResponse>(this.apiUrl);
  }

  getRouteById(id: number): Observable<RouteResponse> {
    return this.http.get<RouteResponse>(`${this.apiUrl}/${id}`);
  }

  createRoute(route: Route): Observable<RouteResponse> {
    return this.http.post<RouteResponse>(this.apiUrl, route);
  }

  updateRoute(id: number, route: Route): Observable<RouteResponse> {
    return this.http.put<RouteResponse>(`${this.apiUrl}/${id}`, route);
  }

  deleteRoute(id: number): Observable<RouteResponse> {
    return this.http.delete<RouteResponse>(`${this.apiUrl}/${id}`);
  }

  getRoutesByOrigin(origin: string): Observable<RouteResponse> {
    return this.http.get<RouteResponse>(`${this.apiUrl}/origin/${origin}`);
  }

  getRoutesByDestination(destination: string): Observable<RouteResponse> {
    return this.http.get<RouteResponse>(`${this.apiUrl}/destination/${destination}`);
  }
} 