import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../profile/profile';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Profile],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  sidebarCollapsed = false;
  activeMenu = 0;

  menu = [
    { label: 'Bookings', icon: 'fas fa-calendar-check' },
    { label: 'Map', icon: 'fas fa-map-marked-alt' },
    { label: 'Ride Status', icon: 'fas fa-taxi' },
    { label: 'Profile', icon: 'fas fa-user' },
    { label: 'Payments', icon: 'fas fa-wallet' }
  ];

  driver = {
    name: 'John Doe',
    rating: 4.9,
    rides: 128,
    email: 'john.driver@email.com',
    phone: '+1234567890'
  };

  bookings = [
    { title: 'Airport Pickup', status: 'Confirmed', pickup: 'Airport', dropoff: 'Downtown', time: 'Today, 10:00 AM' },
    { title: 'Mall Dropoff', status: 'Pending', pickup: 'University', dropoff: 'Mall', time: 'Tomorrow, 2:00 PM' }
  ];

  rideStatus = {
    active: true,
    from: 'Central Park',
    to: 'City Mall',
    startTime: '9:30 AM'
  };

  payments = [
    { date: '2025-06-12', amount: '$45.00', status: 'completed' },
    { date: '2025-06-11', amount: '$32.50', status: 'completed' },
    { date: '2025-06-10', amount: '$18.20', status: 'pending' }
  ];
editProfile: any;
changePassword: any;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveMenu(index: number) {
    this.activeMenu = index;
  }
}