export interface User {
  id?: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'DRIVER' | 'USER';
  createdAt?: string;
  phone?: string;
  // Driver profile fields
  avatar?: string;
  rating?: number;
  totalTrips?: number;
  isOnline?: boolean;
  earnings?: number;
  vehicle?: string;
  licensePlate?: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User[];
} 