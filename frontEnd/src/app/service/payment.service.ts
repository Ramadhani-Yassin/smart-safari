import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, PaymentResponse } from '../model/Payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) { }

  getAllPayments(): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(this.apiUrl);
  }

  getPaymentById(id: number): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/${id}`);
  }

  getPaymentsByStatus(status: string): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/status/${status}`);
  }

  getPaymentsByBooking(bookingId: number): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/booking/${bookingId}`);
  }

  processPayment(id: number): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/process/${id}`, {});
  }

  failPayment(id: number): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/fail/${id}`, {});
  }

  createPaymentForBooking(bookingId: number, paymentMethod: string): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/create-for-booking?bookingId=${bookingId}&paymentMethod=${paymentMethod}`, {});
  }

  deletePayment(id: number): Observable<PaymentResponse> {
    return this.http.delete<PaymentResponse>(`${this.apiUrl}/${id}`);
  }
} 