import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  sidebarCollapsed = false;
  activeMenu = 0;

  menu = [
    { label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { label: 'Map', icon: 'fas fa-map-marked-alt' },
    { label: 'Ride Status', icon: 'fas fa-taxi' },
    { label: 'Profile', icon: 'fas fa-user' },
    { label: 'Payments', icon: 'fas fa-wallet' }
  ];

  user = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+255 123 456 789',
    avatar: 'https://i.pravatar.cc/150?img=12',
    memberSince: 'March 2024',
    isPremium: true,
    totalRides: 45,
    rating: 4.8,
    totalSpent: 1250.75,
    rewardPoints: 850
  };

  bookings = [
    { 
      id: 'BK001', 
      title: 'Airport Pickup', 
      status: 'completed', 
      pickup: 'Zanzibar Airport', 
      dropoff: 'Stone Town Hotel',
      fare: 'TZS 25.00',
      time: 'Today, 10:00 AM'
    },
    { 
      id: 'BK002', 
      title: 'Mall Dropoff', 
      status: 'confirmed', 
      pickup: 'University Campus', 
      dropoff: 'City Mall',
      fare: 'TZS 12.50',
      time: 'Tomorrow, 2:00 PM'
    },
    { 
      id: 'BK003', 
      title: 'Beach Trip', 
      status: 'pending', 
      pickup: 'Hotel', 
      dropoff: 'Nungwi Beach',
      fare: 'TZS 18.00',
      time: 'Yesterday, 4:30 PM'
    }
  ];

  rideStatus = {
    active: true,
    id: 'RS001',
    status: 'in-progress',
    driverName: 'Ali Hassan',
    driverAvatar: 'https://i.pravatar.cc/150?img=8',
    driverRating: 4.9,
    vehicle: 'Toyota Vitz - Z123ABC',
    from: 'Stone Town',
    to: 'Nungwi Beach',
    startTime: '2:30 PM'
  };

  payments = [
    { 
      date: '2025-01-15', 
      amount: 'TZS 25.00', 
      status: 'completed',
      description: 'Airport to Stone Town'
    },
    { 
      date: '2025-01-14', 
      amount: 'TZS 12.50', 
      status: 'completed',
      description: 'Campus to Mall'
    },
    { 
      date: '2025-01-13', 
      amount: 'TZS 18.00', 
      status: 'pending',
      description: 'Hotel to Beach'
    }
  ];

  notifications = [
    { id: 1, message: 'Your ride has been confirmed', time: '5 min ago' },
    { id: 2, message: 'Payment processed successfully', time: '1 hour ago' }
  ];

  monthlySpent = 245.75;

  constructor(private router: Router, private modalService: ModalService) {}

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveMenu(index: number) {
    this.activeMenu = index;
  }

  getCurrentPageTitle(): string {
    return this.menu[this.activeMenu]?.label || 'Dashboard';
  }

  getCurrentPageDescription(): string {
    const descriptions = [
      'Monitor your rides and bookings',
      'View live map and nearby drivers',
      'Track your current ride status',
      'Manage your profile and preferences',
      'View payment history and transactions'
    ];
    return descriptions[this.activeMenu] || '';
  }

  bookRide() {
    this.modalService.showInfo('Book New Ride', 'Redirecting to booking page...');
    // Navigate to booking page or open booking modal
  }

  trackRide(bookingId: string) {
    this.modalService.showInfo('Track Ride', `Tracking ride TZS {bookingId}...`);
    // Implement ride tracking functionality
  }

  rateRide(bookingId: string) {
    this.modalService.showInfo('Rate Ride', `Opening rating form for ride TZS {bookingId}...`);
    // Open rating modal
  }

  viewDetails(bookingId: string) {
    this.modalService.showInfo('View Details', `Showing details for ride TZS {bookingId}...`);
    // Show booking details
  }

  contactDriver() {
    this.modalService.showInfo('Contact Driver', 'Calling driver...');
    // Implement driver contact functionality
  }

  shareLocation() {
    this.modalService.showInfo('Share Location', 'Sharing your location with driver...');
    // Implement location sharing
  }

  logout() {
    this.modalService.showWarning('Logout', 'Are you sure you want to logout?');
    setTimeout(() => {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }, 2000);
  }
}