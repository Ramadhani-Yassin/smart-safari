import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserResponse } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(this.apiUrl);
  }

  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  getUsersByRole(role: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/role/${role}`);
  }

  deleteUser(id: number): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${this.apiUrl}/${id}`);
  }

  getCustomerCount(): Observable<{ success: boolean; message: string; data: number }> {
    return this.http.get<{ success: boolean; message: string; data: number }>(`${this.apiUrl}/count/customers`);
  }

  getDriverCount(): Observable<{ success: boolean; message: string; data: number }> {
    return this.http.get<{ success: boolean; message: string; data: number }>(`${this.apiUrl}/count/drivers`);
  }
} 