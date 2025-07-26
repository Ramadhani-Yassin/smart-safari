import { User } from './User';
import { Route } from './Route';

export interface Booking {
  id?: number;
  customer: User;
  driver?: User;
  route: Route;
  status: 'PENDING' | 'ACCEPTED' | 'ON_WAY' | 'IN_PROGRESS' | 'DECLINED' | 'COMPLETED' | 'PAID';
  scheduledTime: string;
  createdAt?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: Booking[];
} 