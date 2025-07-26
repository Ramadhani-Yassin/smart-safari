import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { BookingService } from '../../service/booking.service';
import { RouteService } from '../../service/route.service';
import { PaymentService } from '../../service/payment.service';
import { Booking } from '../../model/Booking';
import { User } from '../../model/User';
import { Route } from '../../model/Route';
import { Payment } from '../../model/Payment';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-dashboard.html',
  styleUrl: './driver-dashboard.css'
})
export class DriverDashboard implements OnInit {
  sidebarCollapsed = false;
  activeMenu = 0;

  menu = [
    { label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { label: 'Ride Requests', icon: 'fas fa-car' },
    { label: 'Active Rides', icon: 'fas fa-route' },
    { label: 'Earnings', icon: 'fas fa-money-bill-wave' },
    { label: 'Profile', icon: 'fas fa-user' }
  ];

  // Driver data (in real app, get from session/localStorage)
  driver: User = {
    id: 2,
    name: 'Ali Said',
    email: 'ali.said@email.com',
    role: 'DRIVER',
    createdAt: '',
    phone: '+255 123 456 789',
    avatar: '', // No profile picture
    rating: 4.7,
    totalTrips: 0,
    isOnline: true,
    earnings: 0,
    vehicle: 'Toyota Vitz',
    licensePlate: 'Z123ABC',
  };

  // Real data from services
  rideRequests: Booking[] = [];
  activeRides: Booking[] = [];
  completedRides: Booking[] = [];
  availableRoutes: Route[] = [];
  payments: Payment[] = [];
  
  // Statistics
  totalEarnings = 0;
  weeklyEarnings = 0;
  monthlyEarnings = 0;
  earningsProgress = 0;
  totalRides = 0;
  completedRidesCount = 0;
  pendingRidesCount = 0;

  // Loading states
  isLoading = false;
  isLoadingRequests = false;
  isLoadingRides = false;

  constructor(
    private router: Router,
    private modalService: ModalService,
    private bookingService: BookingService,
    private routeService: RouteService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.loadDriverData();
    this.loadDashboardData();
  }

  loadDriverData() {
    // In real app, fetch driver info from backend or session
    // For now, use mock data above but load from localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.role === 'DRIVER') {
          this.driver = { ...this.driver, ...user };
        }
      }
    }
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Load ride requests (PENDING bookings)
    this.loadRideRequests();
    
    // Load active rides (ACCEPTED bookings)
    this.loadActiveRides();
    
    // Load completed rides
    this.loadCompletedRides();
    
    // Load available routes
    this.loadAvailableRoutes();
    
    // Load earnings data
    this.loadEarnings();
    
    this.isLoading = false;
  }

  loadRideRequests() {
    // Prevent multiple simultaneous requests
    if (this.isLoadingRequests) {
      console.log('⏳ Already loading ride requests, skipping...');
      return;
    }
    
    this.isLoadingRequests = true;
    console.log('🔍 Loading ride requests...');
    // Fetch bookings with status PENDING (available for drivers to accept)
    this.bookingService.getBookingsByStatus('PENDING').subscribe({
      next: (response) => {
        console.log('✅ Ride requests response:', response);
        if (response.success) {
          this.rideRequests = response.data;
          this.pendingRidesCount = this.rideRequests.length;
          console.log('📊 Found', this.rideRequests.length, 'pending ride requests');
        } else {
          console.error('❌ Ride requests failed:', response.message);
        }
        this.isLoadingRequests = false;
      },
      error: (error) => {
        console.error('❌ Error loading ride requests:', error);
        this.isLoadingRequests = false;
      }
    });
  }

  loadActiveRides() {
    // Prevent multiple simultaneous requests
    if (this.isLoadingRides) {
      console.log('⏳ Already loading active rides, skipping...');
      return;
    }
    
    this.isLoadingRides = true;
    console.log('🔍 Loading active rides...');
    this.bookingService.getBookingsByStatus('ON_WAY').subscribe({
      next: (response) => {
        console.log('✅ Active rides response:', response);
        if (response.success) {
          this.activeRides = response.data.filter(ride => ride.driver?.id === this.driver.id);
          this.totalRides = this.activeRides.length;
          console.log('📊 Found', this.activeRides.length, 'active rides for driver');
        } else {
          console.error('❌ Active rides failed:', response.message);
        }
        this.isLoadingRides = false;
      },
      error: (error) => {
        console.error('❌ Error loading active rides:', error);
        this.isLoadingRides = false;
      }
    });
  }

  loadCompletedRides() {
    // Fetch completed rides for this driver
    this.bookingService.getBookingsForDriver(this.driver.id!).subscribe({
      next: (response) => {
        if (response.success) {
          this.completedRides = response.data.filter(b => b.status === 'COMPLETED');
          this.completedRidesCount = this.completedRides.length;
          this.driver.totalTrips = this.completedRidesCount;
        }
      },
      error: (error) => {
        console.error('Error loading completed rides:', error);
      }
    });
  }

  loadAvailableRoutes() {
    // Load available routes for reference
    this.routeService.getAllRoutes().subscribe({
      next: (response) => {
        if (response.success) {
          this.availableRoutes = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading routes:', error);
      }
    });
  }

  loadEarnings() {
    // Calculate earnings from completed rides
    this.bookingService.getBookingsForDriver(this.driver.id!).subscribe({
      next: (response) => {
        if (response.success) {
          const completed = response.data.filter(b => b.status === 'COMPLETED');
          this.totalEarnings = completed.reduce((sum, b) => sum + (b.route?.price || 0), 0);
          this.driver.earnings = this.totalEarnings;
          
          // Calculate weekly and monthly earnings (simplified)
          this.weeklyEarnings = this.totalEarnings * 0.3; // 30% of total
          this.monthlyEarnings = this.totalEarnings * 0.8; // 80% of total
          this.earningsProgress = Math.min(100, (this.totalEarnings / 1000) * 100); // Progress towards 1000 TZS goal
        }
      },
      error: (error) => {
        console.error('Error loading earnings:', error);
      }
    });
  }

  refreshAllData() {
    console.log('🔄 Refreshing all dashboard data...');
    this.loadDashboardData();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveMenu(index: number) {
    this.activeMenu = index;
    // Only reload specific data when switching to different sections
    // Don't reload everything on every menu click
    if (index === 1 && this.rideRequests.length === 0) {
      this.loadRideRequests();
    }
    if (index === 2 && this.activeRides.length === 0) {
      this.loadActiveRides();
    }
    if (index === 3 && this.totalEarnings === 0) {
      this.loadEarnings();
    }
  }

  getCurrentPageTitle(): string {
    return this.menu[this.activeMenu]?.label || 'Dashboard';
  }

  getCurrentPageDescription(): string {
    const descriptions = [
      'Monitor your ride requests and earnings',
      'Accept or decline incoming ride requests',
      'Manage your active rides and passengers',
      'Track your earnings and financial goals',
      'Update your profile and preferences'
    ];
    return descriptions[this.activeMenu] || '';
  }

  toggleStatus() {
    this.driver.isOnline = !this.driver.isOnline;
    const status = this.driver.isOnline ? 'online' : 'offline';
    this.modalService.showInfo('Status Updated', `You are now ${status} and ${status === 'online' ? 'ready to accept rides' : 'no longer receiving ride requests'}.`);
  }

  acceptRide(bookingId: number) {
    console.log('🚗 Accepting ride with booking ID:', bookingId);
    console.log('👤 Driver data being sent:', this.driver);
    
    // Send only the necessary driver data
    const driverData = {
      id: this.driver.id,
      name: this.driver.name,
      email: this.driver.email,
      role: this.driver.role
    };
    
    this.bookingService.acceptBooking(bookingId, driverData).subscribe({
      next: (response) => {
        if (response.success) {
          this.modalService.showSuccess('Ride Accepted! 🚗', `You've accepted the ride and are now ON WAY to pick up your passenger.`);
          this.loadRideRequests();
          this.loadActiveRides();
        } else {
          this.modalService.showError('Accept Failed', response.message || 'Failed to accept ride');
        }
      },
      error: (error) => {
        console.error('❌ Error accepting ride:', error);
        console.error('❌ Error details:', error.error);
        this.modalService.showError('Accept Error', 'Failed to accept ride. Please try again.');
      }
    });
  }

  declineRide(bookingId: number) {
    console.log('🚫 Declining ride with booking ID:', bookingId);
    console.log('👤 Driver data being sent:', this.driver);
    
    // Send only the necessary driver data
    const driverData = {
      id: this.driver.id,
      name: this.driver.name,
      email: this.driver.email,
      role: this.driver.role
    };
    
    this.bookingService.declineBooking(bookingId, driverData).subscribe({
      next: (response) => {
        if (response.success) {
          this.modalService.showInfo('Ride Declined', 'The ride request has been declined and is still available for other drivers.');
          this.loadRideRequests();
        } else {
          this.modalService.showError('Decline Failed', response.message || 'Failed to decline ride');
        }
      },
      error: (error) => {
        console.error('❌ Error declining ride:', error);
        console.error('❌ Error details:', error.error);
        this.modalService.showError('Decline Error', 'Failed to decline ride. Please try again.');
      }
    });
  }

  startRide(rideId: number) {
    this.bookingService.updateBookingStatus(rideId, 'IN_PROGRESS').subscribe({
      next: (response) => {
        if (response.success) {
          this.modalService.showSuccess('Ride Started! 🚗', 'You have started the ride. The passenger is now in your vehicle.');
          this.loadActiveRides();
        } else {
          this.modalService.showError('Start Failed', response.message || 'Failed to start ride');
        }
      },
      error: (error) => {
        console.error('Error starting ride:', error);
        this.modalService.showError('Start Error', 'Failed to start ride. Please try again.');
      }
    });
  }

  completeRide(rideId: number) {
    // Update booking status to COMPLETED
    this.bookingService.updateBookingStatus(rideId, 'COMPLETED').subscribe({
      next: (response) => {
        if (response.success) {
          this.modalService.showSuccess('Ride Completed! ✅', `You've successfully completed the ride. Payment will be processed.`);
          this.loadActiveRides();
          this.loadCompletedRides();
          this.loadEarnings();
        } else {
          this.modalService.showError('Complete Failed', response.message || 'Failed to complete ride');
        }
      },
      error: (error) => {
        console.error('Error completing ride:', error);
        this.modalService.showError('Complete Error', 'Failed to complete ride');
      }
    });
  }

  contactPassenger(rideId: number) {
    const ride = this.activeRides.find(r => r.id === rideId);
    if (ride) {
      this.modalService.showInfo('Contact Passenger', `Calling ${ride.customer?.name || 'Passenger'} at ${ride.customer?.phone || 'N/A'}...`);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED':
      case 'PAID':
        return 'completed';
      case 'ON_WAY':
        return 'on-way';
      case 'IN_PROGRESS':
        return 'in-progress';
      case 'ACCEPTED':
        return 'accepted';
      case 'PENDING':
        return 'pending';
      case 'DECLINED':
        return 'declined';
      default:
        return '';
    }
  }

  logout() {
    this.modalService.showWarning('Logout', 'Are you sure you want to logout? You will go offline and stop receiving ride requests.');
    setTimeout(() => {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }, 2000);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }

  formatCurrency(amount: number | undefined): string {
    if (amount == null) return 'TZS 0';
    return `TZS ${amount.toLocaleString()}`;
  }
}
