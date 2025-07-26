import { Booking } from './Booking';

export interface Payment {
  id?: number;
  booking: Booking;
  amount: number;
  paymentMethod: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  paidAt?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: Payment[];
} 