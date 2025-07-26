import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingResponse } from '../model/Booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) { }

  getAllBookings(): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(this.apiUrl);
  }

  getBookingById(id: number): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.apiUrl}/${id}`);
  }

  createBooking(booking: any): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.apiUrl, booking);
  }

  getBookingsByStatus(status: string): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.apiUrl}/status/${status}`);
  }

  getPendingBookings(): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.apiUrl}/pending`);
  }

  getBookingsByCustomer(customerId: number): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.apiUrl}/customer/${customerId}`);
  }

  getBookingsForDriver(driverId: number): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.apiUrl}/driver/${driverId}`);
  }

  acceptBooking(bookingId: number, driver: any): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${bookingId}/accept`, driver);
  }

  declineBooking(bookingId: number, driver: any): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${bookingId}/decline`, driver);
  }

  updateBookingStatus(id: number, status: string): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }

  deleteBooking(id: number): Observable<BookingResponse> {
    return this.http.delete<BookingResponse>(`${this.apiUrl}/${id}`);
  }
} 