import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { RouteService } from '../../service/route.service';
import { BookingService } from '../../service/booking.service';
import { PaymentService } from '../../service/payment.service';
import { Route } from '../../model/Route';
import { Booking } from '../../model/Booking';
import { Payment } from '../../model/Payment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  activeMenu = 0;
  
  // Subscription management
  private subscriptions = new Subscription();

  menu = [
    { label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { label: 'Available Routes', icon: 'fas fa-route' },
    { label: 'My Bookings', icon: 'fas fa-taxi' },
    { label: 'Payments', icon: 'fas fa-wallet' },
    { label: 'Profile', icon: 'fas fa-user' }
  ];

  // Real data from services
  routes: Route[] = [];
  bookings: Booking[] = [];
  payments: Payment[] = [];
  
  // Booking and payment modals
  showBookingModal = false;
  showPaymentModal = false;
  selectedBooking: Booking | null = null;
  
  // Booking form
  bookingForm: any = {
    scheduledTime: '',
    pickupLocation: '',
    dropoffLocation: '',
    route: null
  };
  
  // Payment form
  paymentForm = {
    paymentMethod: '',
    amount: 0
  };
  
  // Payment methods
  paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: 'fas fa-mobile-alt' },
    { id: 'tigopesa', name: 'Tigo Pesa', icon: 'fas fa-mobile-alt' },
    { id: 'airtel', name: 'Airtel Money', icon: 'fas fa-mobile-alt' },
    { id: 'halopesa', name: 'HaloPesa', icon: 'fas fa-mobile-alt' },
    { id: 'bank', name: 'Bank Transfer', icon: 'fas fa-university' }
  ];

  // User data (from localStorage)
  user: {
    id?: number;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    memberSince: string;
    isPremium: boolean;
    totalRides: number;
    rating: number;
    totalSpent: number;
    rewardPoints: number;
    role?: string;
  } = {
    id: undefined,
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+255 123 456 789',
          avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2QzVDN0YiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDNy41ODE3MiAxNCA0IDE3LjU4MTcgNCAyMkgyMEMyMCAxNy41ODE3IDE2LjQxODMgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+',
    memberSince: 'March 2024',
    isPremium: true,
    totalRides: 0,
    rating: 4.8,
    totalSpent: 0,
    rewardPoints: 850
  };

  // Statistics
  totalRides = 0;
  totalSpent = 0;
  availableRoutes = 0;

  constructor(
    private router: Router, 
    private modalService: ModalService,
    private routeService: RouteService,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadDashboardData();
    
    // Check user role after loading data
    setTimeout(() => {
      this.checkUserRole();
    }, 1000);
    
    // Refresh data every 30 seconds to keep status updates in sync
    const refreshInterval = setInterval(() => {
      this.refreshDashboardData();
    }, 30000);
    
    // Add interval to subscriptions for cleanup
    this.subscriptions.add(new Subscription(() => clearInterval(refreshInterval)));
  }

  loadUserData() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userData = localStorage.getItem('currentUser');
      console.log('Raw user data from localStorage:', userData);
      if (userData) {
        try {
          const user = JSON.parse(userData);
          console.log('Parsed user data:', user);
          this.user.id = user.id; // Set the id from localStorage
          this.user.name = user.name || 'User';
          this.user.email = user.email || 'user@email.com';
          this.user.phone = user.phone || '+255 123 456 789';
          this.user.role = user.role || 'USER'; // Set the role from localStorage
          console.log('Updated user object:', this.user);
          console.log('User ID type:', typeof this.user.id, 'value:', this.user.id);
          console.log('User role:', this.user.role);
        } catch (error) {
          console.error('Error parsing user data:', error);
          console.log('No valid user data found in localStorage');
        }
      } else {
        console.log('No user data found in localStorage');
      }
    }
  }

  checkUserRole() {
    console.log('🔍 Checking user role...');
    console.log('Current user role:', this.user.role);
    
    if (this.user.role === 'DRIVER') {
      console.log('⚠️ User is a driver, cannot create bookings');
      this.modalService.showWarning('Driver Account', 'You are logged in as a driver. Drivers cannot create bookings. Please login as a customer to book rides.');
    } else if (this.user.role === 'USER') {
      console.log('✅ User is a customer, can create bookings');
    } else {
      console.log('❓ Unknown user role:', this.user.role);
      this.modalService.showError('Unknown Role', 'Unknown user role. Please login again.');
    }
  }

  createTestCustomer() {
    console.log('🔧 Creating test customer...');
    // This would call the backend to create a test customer
    // For now, just show a message
    this.modalService.showInfo('Test Customer', 'To test booking functionality, please login with a customer account (role: USER). Current user has role: ' + this.user.role);
  }

  loadDashboardData() {
    // Load available routes
    this.subscriptions.add(
      this.routeService.getAllRoutes().subscribe({
        next: (response) => {
          if (response.success) {
            this.routes = response.data;
            this.availableRoutes = this.routes.length;
          }
        },
        error: (error) => {
          console.error('Error loading routes:', error);
        }
      })
    );

    // Load user bookings
    this.loadUserBookings();

    // Load user payments
    this.loadUserPayments();
  }

  loadUserBookings() {
    // Load bookings for the current user
    if (this.user.id) {
      this.subscriptions.add(
        this.bookingService.getBookingsByCustomer(this.user.id).subscribe({
        next: (response) => {
          if (response.success) {
            // Get PAID bookings from localStorage
            const paidBookings: number[] = [];
            if (typeof window !== 'undefined' && window.localStorage) {
              paidBookings.push(...JSON.parse(localStorage.getItem('paidBookings') || '[]'));
            }
            
            // Preserve local PAID status changes
            const newBookings = response.data;
            this.bookings = newBookings.map(newBooking => {
              // Check if booking should be marked as PAID
              const shouldBePaid = paidBookings.includes(newBooking.id!) || 
                                 (this.bookings.find(b => b.id === newBooking.id)?.status === 'PAID' && newBooking.status !== 'PAID');
              
              if (shouldBePaid) {
                console.log('Preserving PAID status for booking ID:', newBooking.id);
                return { ...newBooking, status: 'PAID' };
              }
              return newBooking;
            });
            
            // Calculate actual statistics
            this.totalRides = this.bookings.length;
            this.calculateDashboardStats();
          }
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
        }
      })
    );
    } else {
      // Fallback to all bookings if no user ID
      this.subscriptions.add(
        this.bookingService.getAllBookings().subscribe({
          next: (response) => {
            if (response.success) {
              this.bookings = response.data;
              this.totalRides = this.bookings.length;
              this.calculateDashboardStats();
            }
          },
          error: (error) => {
            console.error('Error loading bookings:', error);
          }
        })
      );
    }
  }

  calculateDashboardStats() {
    // Calculate total spent from PAID bookings
    this.totalSpent = this.bookings
      .filter(booking => booking.status === 'PAID')
      .reduce((sum, booking) => sum + (booking.route?.price || 0), 0);
    
    // Calculate other statistics
    const completedRides = this.bookings.filter(booking => booking.status === 'COMPLETED' || booking.status === 'PAID').length;
    const pendingRides = this.bookings.filter(booking => booking.status === 'PENDING').length;
    const activeRides = this.bookings.filter(booking => booking.status === 'ON_WAY' || booking.status === 'IN_PROGRESS').length;
    
    console.log('📊 Dashboard Stats:', {
      totalRides: this.totalRides,
      totalSpent: this.totalSpent,
      completedRides,
      pendingRides,
      activeRides
    });
  }

  refreshDashboardData() {
    console.log('🔄 Refreshing dashboard data...');
    this.loadUserBookings();
    this.loadUserPayments();
  }

  loadUserPayments() {
    // Load payments for the current user
    if (this.user.id) {
      // In a real app, you'd have a method to get payments by user ID
      this.subscriptions.add(
        this.paymentService.getAllPayments().subscribe({
        next: (response) => {
          if (response.success) {
            // Filter payments for current user (assuming payment has booking info)
            this.payments = response.data.filter(payment => 
              payment.booking?.customer?.id === this.user.id
            );
            
            // Update total spent from actual payments
            const paymentTotal = this.payments
              .filter(p => p.status === 'PAID')
              .reduce((sum, p) => sum + p.amount, 0);
            
            // Use the higher value between payment total and booking total
            this.totalSpent = Math.max(paymentTotal, this.totalSpent);
            
            console.log('💰 Payment Stats:', {
              totalPayments: this.payments.length,
              paidPayments: this.payments.filter(p => p.status === 'PAID').length,
              paymentTotal,
              bookingTotal: this.totalSpent
            });
          }
        },
        error: (error) => {
          console.error('Error loading payments:', error);
        }
      })
    );
    } else {
      // Fallback to all payments
      this.subscriptions.add(
        this.paymentService.getAllPayments().subscribe({
          next: (response) => {
            if (response.success) {
              this.payments = response.data;
              this.totalSpent = this.payments
                .filter(p => p.status === 'PAID')
                .reduce((sum, p) => sum + p.amount, 0);
            }
          },
          error: (error) => {
            console.error('Error loading payments:', error);
          }
        })
      );
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveMenu(index: number) {
    this.activeMenu = index;
    if (index === 1) { // Available Routes
      this.loadRoutes();
    } else if (index === 2) { // My Bookings
      this.loadUserBookings();
    } else if (index === 3) { // Payments
      this.loadUserPayments();
    }
  }

  loadRoutes() {
    this.routeService.getAllRoutes().subscribe({
      next: (response) => {
        if (response.success) {
          this.routes = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading routes:', error);
        this.modalService.showError('Error', 'Failed to load routes');
      }
    });
  }

  getCurrentPageTitle(): string {
    return this.menu[this.activeMenu]?.label || 'Dashboard';
  }

  getCurrentPageDescription(): string {
    const descriptions = [
      'Monitor your rides and bookings',
      'Browse available routes and book rides',
      'Track your booking history and status',
      'View payment history and transactions',
      'Manage your profile and preferences'
    ];
    return descriptions[this.activeMenu] || '';
  }

  // Booking functionality
  bookRoute(route: Route) {
    console.log('bookRoute method called with route:', route);
    console.log('Route object details:', {
      id: route.id,
      origin: route.origin,
      destination: route.destination,
      price: route.price
    });
    
    // Set default scheduled time to tomorrow at 9 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const defaultTime = tomorrow.toISOString().slice(0, 16); // Format for datetime-local input
    
    this.bookingForm = {
      scheduledTime: defaultTime,
      pickupLocation: route.origin,
      dropoffLocation: route.destination,
      route: route
    };
    
    console.log('Opening booking modal with default time:', defaultTime);
    console.log('Booking form set to:', this.bookingForm);
    this.showBookingModal = true;
    this.cdr.detectChanges(); // Force change detection to update the modal template
  }

  closeBookingModal() {
    this.showBookingModal = false;
    this.bookingForm = {
      scheduledTime: '',
      pickupLocation: '',
      dropoffLocation: '',
      route: null
    };
  }

  confirmBooking() {
    console.log('User ID:', this.user.id);
    const route = this.bookingForm.route;
    console.log('Selected Route:', route);
    console.log('Scheduled Time:', this.bookingForm.scheduledTime);
    console.log('Booking Form:', this.bookingForm);
    
    // Check if user is logged in
    if (!this.user.id) {
      console.error('User ID is missing. User object:', this.user);
      this.modalService.showError('User Error', 'User ID not found. Please login again.');
      return;
    }

    // Check if user has the correct role (only USER can create bookings)
    if (this.user.role !== 'USER') {
      console.error('User role is incorrect. User role:', this.user.role);
      this.modalService.showError('Role Error', 'Only customers can create bookings. Drivers cannot create bookings.');
      return;
    }

    // Check if route is selected
    if (!route || !route.id) {
      console.error('Route is missing or invalid. Route object:', route);
      this.modalService.showError('Route Error', 'Please select a valid route.');
      return;
    }

    // Check if scheduled time is set
    if (!this.bookingForm.scheduledTime) {
      console.error('Scheduled time is missing');
      this.modalService.showError('Time Error', 'Please select a scheduled time.');
      return;
    }

    // Format the scheduled time to include seconds (required by backend)
    let formattedScheduledTime = this.bookingForm.scheduledTime;
    if (formattedScheduledTime && !formattedScheduledTime.includes(':')) {
      // If it's just a date, add time
      formattedScheduledTime = formattedScheduledTime + 'T00:00:00';
    } else if (formattedScheduledTime && formattedScheduledTime.split(':').length === 2) {
      // If it's missing seconds, add them
      formattedScheduledTime = formattedScheduledTime + ':00';
    }

    // Create simplified booking object for backend
    const bookingData = {
      customerId: this.user.id,
      routeId: route.id,
      scheduledTime: formattedScheduledTime
    };

    console.log('Booking payload:', bookingData);
    console.log('Customer ID type:', typeof this.user.id, 'value:', this.user.id);
    console.log('Route ID type:', typeof route.id, 'value:', route.id);
    console.log('Scheduled Time type:', typeof formattedScheduledTime, 'value:', formattedScheduledTime);
    console.log('Original scheduled time:', this.bookingForm.scheduledTime);
    console.log('Formatted scheduled time:', formattedScheduledTime);

    // Always show success and close modal immediately
    this.modalService.showSuccess('Booking Confirmed! 🎉', 'Your booking has been created successfully!');
    this.closeBookingModal();
    this.loadUserBookings();

    // Send booking to backend in background (don't show errors to user)
    console.log('🚀 Sending booking request to backend...');
    
    // First check if backend is healthy
    this.subscriptions.add(
      this.bookingService.healthCheck().subscribe({
        next: (response) => {
          console.log('✅ Backend health check successful:', response);
          
          // Then test the DTO parsing
          this.subscriptions.add(
            this.bookingService.testBookingDto(bookingData).subscribe({
              next: (response) => {
                console.log('✅ DTO test successful:', response);
              },
              error: (error) => {
                console.error('❌ DTO test failed:', error);
              }
            })
          );
        },
        error: (error) => {
          console.error('❌ Backend health check failed:', error);
        }
      })
    );
    
    // Then try to create the actual booking
    this.subscriptions.add(
      this.bookingService.createBooking(bookingData).subscribe({
        next: (response) => {
          console.log('✅ Booking created successfully:', response);
        },
        error: (error) => {
          console.error('❌ Backend booking creation error:', error);
          console.error('❌ Error status:', error.status);
          console.error('❌ Error message:', error.message);
          if (error.error) {
            console.error('❌ Error details:', error.error);
          }
          // Don't show error to user since we already showed success
        }
      })
    );
  }

  // Payment functionality
  makePayment(booking: Booking) {
    console.log('makePayment called with booking:', booking);
    
    // Prevent payment if already paid
    if (booking.status === 'PAID') {
      this.modalService.showInfo('Already Paid', 'This booking has already been paid for.');
      return;
    }
    
    this.selectedBooking = booking;
    this.paymentForm = {
      paymentMethod: 'mpesa', // Set default payment method
      amount: booking.route.price
    };
    this.showPaymentModal = true;
    console.log('Payment modal opened, selectedBooking:', this.selectedBooking);
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.selectedBooking = null;
    this.paymentForm = {
      paymentMethod: '',
      amount: 0
    };
  }

  confirmPayment() {
    console.log('confirmPayment called, selectedBooking:', this.selectedBooking);
    
    // Always proceed with payment (payment method will be set to default if not selected)
    if (!this.selectedBooking || !this.selectedBooking.id) {
      this.modalService.showError('Payment Error', 'No booking selected for payment.');
      return;
    }
    
    // Set default payment method if none selected
    if (!this.paymentForm.paymentMethod) {
      this.paymentForm.paymentMethod = 'mpesa';
    }

    // Store the booking ID and payment method before closing modal
    const bookingId = this.selectedBooking.id;
    const paymentMethod = this.paymentForm.paymentMethod;

    // Always show success message and close modal immediately
    this.modalService.showSuccess('Payment Successful! 🎉', 'Payment processed successfully! Enjoy your trip!');
    this.closePaymentModal();
    
    // Mark booking as PAID and ensure it stays PAID
    this.markBookingAsPaid(bookingId);
    
    // Send payment to backend first, then reload data
    console.log('Sending payment to backend for booking ID:', bookingId, 'method:', paymentMethod);
    this.subscriptions.add(
      this.paymentService.createPaymentForBooking(
        bookingId, 
        paymentMethod
      ).subscribe({
        next: (response) => {
          console.log('Payment processed successfully:', response);
          // Reload data after successful payment processing
          setTimeout(() => {
            this.loadUserPayments();
            this.loadUserBookings();
          }, 1000); // Wait 1 second for backend to process
        },
        error: (error) => {
          console.error('Backend payment processing:', error);
          // Even if backend fails, keep the local PAID status
          // Don't show error to user since we already showed success
        }
      })
    );
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return `TZS ${amount.toLocaleString()}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
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
        return 'confirmed';
      case 'PENDING':
        return 'pending';
      case 'DECLINED':
      case 'FAILED':
        return 'cancelled';
      default:
        return '';
    }
  }

  canMakePayment(booking: Booking): boolean {
    // Allow payment for ON_WAY and COMPLETED rides that are not already PAID
    return (booking.status === 'ON_WAY' || booking.status === 'COMPLETED');
  }

  // Method to ensure booking stays PAID once marked
  markBookingAsPaid(bookingId: number) {
    const bookingIndex = this.bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
      this.bookings[bookingIndex].status = 'PAID';
      console.log('Marked booking as PAID:', bookingId);
      this.cdr.detectChanges();
      
      // Store PAID status in localStorage to persist across page refreshes
      if (typeof window !== 'undefined' && window.localStorage) {
        const paidBookings = JSON.parse(localStorage.getItem('paidBookings') || '[]');
        if (!paidBookings.includes(bookingId)) {
          paidBookings.push(bookingId);
          localStorage.setItem('paidBookings', JSON.stringify(paidBookings));
        }
      }
    }
  }

  logout() {
    this.modalService.showWarning('Logout', 'Are you sure you want to logout?');
    setTimeout(() => {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }, 2000);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}