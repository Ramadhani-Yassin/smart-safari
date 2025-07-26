import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { RouteService } from '../../service/route.service';
import { UserService } from '../../service/user.service';
import { BookingService } from '../../service/booking.service';
import { PaymentService } from '../../service/payment.service';
import { Route } from '../../model/Route';
import { User } from '../../model/User';
import { Booking } from '../../model/Booking';
import { Payment } from '../../model/Payment';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './administration.html',
  styleUrls: ['./administration.css']
})
export class Administration implements OnInit {
  activeMenu = 0;
  
  // Data properties
  routes: Route[] = [];
  users: User[] = [];
  customers: User[] = [];
  drivers: User[] = [];
  bookings: Booking[] = [];
  payments: Payment[] = [];
  
  // Statistics
  customerCount = 0;
  driverCount = 0;
  totalRevenue = 0;
  todayTrips = 0;
  
  // Route management
  showAddRouteModal = false;
  newRoute: Route = {
    origin: '',
    destination: '',
    price: 0
  };
  
  // Add properties for editing routes
  showEditRouteModal = false;
  editRouteData: Route = { id: 0, origin: '', destination: '', price: 0 };
  
  // User management
  userToDelete: User | null = null;
  
  // Loading states
  isLoading = false;
  
  // Sidebar collapse
  sidebarCollapsed = false;

  constructor(
    private router: Router, 
    private modalService: ModalService,
    private routeService: RouteService,
    private userService: UserService,
    private bookingService: BookingService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  setActiveMenu(index: number): void {
    this.activeMenu = index;
    this.loadDataForMenu(index);
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Load customers and count them
    this.userService.getUsersByRole('USER').subscribe({
      next: (response) => {
        if (response.success) {
          this.customers = response.data;
          this.customerCount = this.customers.length;
        }
      },
      error: (error) => {
        console.error('Error loading customers:', error);
      }
    });

    // Load drivers and count them
    this.userService.getUsersByRole('DRIVER').subscribe({
      next: (response) => {
        if (response.success) {
          this.drivers = response.data;
          this.driverCount = this.drivers.length;
        }
      },
      error: (error) => {
        console.error('Error loading drivers:', error);
      }
    });

    // Load recent bookings
    this.bookingService.getAllBookings().subscribe({
      next: (response) => {
        if (response.success) {
          this.bookings = response.data.slice(0, 5); // Get latest 5
          this.todayTrips = this.bookings.filter(b => 
            new Date(b.createdAt!).toDateString() === new Date().toDateString()
          ).length;
        }
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
      }
    });

    // Load payments for revenue calculation
    this.paymentService.getAllPayments().subscribe({
      next: (response) => {
        if (response.success) {
          this.payments = response.data;
          this.totalRevenue = this.payments
            .filter(p => p.status === 'PAID')
            .reduce((sum, p) => sum + p.amount, 0);
        }
      },
      error: (error) => {
        console.error('Error loading payments:', error);
      }
    });

    this.isLoading = false;
  }

  loadDataForMenu(menuIndex: number) {
    switch (menuIndex) {
      case 1: // Customers
        this.loadCustomers();
        break;
      case 2: // Drivers
        this.loadDrivers();
        break;
      case 3: // Routes
        this.loadRoutes();
        break;
      case 4: // Payments
        this.loadPayments();
        break;
      case 0: // Dashboard
      default:
        this.loadDashboardData();
        break;
    }
  }

  loadCustomers() {
    this.userService.getUsersByRole('USER').subscribe({
      next: (response) => {
        if (response.success) {
          this.customers = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.modalService.showError('Error', 'Failed to load customers');
      }
    });
  }

  loadDrivers() {
    console.log('Calling loadDrivers...');
    this.userService.getUsersByRole('DRIVER').subscribe({
      next: (response) => {
        console.log('Drivers response:', response);
        if (response.success) {
          this.drivers = response.data;
          console.log('Drivers loaded:', this.drivers.length);
        }
      },
      error: (error) => {
        console.error('Error loading drivers:', error);
        this.modalService.showError('Error', 'Failed to load drivers');
      }
    });
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

  loadPayments() {
    this.paymentService.getAllPayments().subscribe({
      next: (response) => {
        if (response.success) {
          this.payments = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.modalService.showError('Error', 'Failed to load payments');
      }
    });
  }

  // Route Management
  showAddRoute() {
    this.showAddRouteModal = true;
    this.newRoute = {
      origin: '',
      destination: '',
      price: 0
    };
  }

  closeAddRouteModal() {
    this.showAddRouteModal = false;
  }

  addRoute() {
    if (!this.newRoute.origin || !this.newRoute.destination || this.newRoute.price <= 0) {
      this.modalService.showError('Validation Error', 'Please fill all fields correctly');
      return;
    }

    this.routeService.createRoute(this.newRoute).subscribe({
      next: (response) => {
        if (response.success) {
          this.modalService.showSuccess('Success', 'Route added successfully');
          this.closeAddRouteModal();
          this.loadRoutes();
        } else {
          this.modalService.showError('Error', response.message);
        }
      },
      error: (error) => {
        console.error('Error adding route:', error);
        this.modalService.showError('Error', 'Failed to add route');
      }
    });
  }

  deleteRoute(routeId: number) {
    // Show confirmation dialog first
    if (confirm('Are you sure you want to delete this route? This action cannot be undone.')) {
      this.routeService.deleteRoute(routeId).subscribe({
        next: (response) => {
          if (response.success) {
            this.modalService.showSuccess('Success', 'Route deleted successfully');
            this.loadRoutes();
          } else {
            this.modalService.showError('Cannot Delete Route', response.message || 'Failed to delete route');
          }
        },
        error: (error) => {
          console.error('Error deleting route:', error);
          // Extract the error message from the backend response
          let errorMessage = 'Failed to delete route. Please try again.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          this.modalService.showError('Cannot Delete Route', errorMessage);
        }
      });
    }
  }

  // Add method to show edit modal
  showEditRoute(route: Route) {
    this.editRouteData = { ...route };
    this.showEditRouteModal = true;
  }

  // Add method to close edit modal
  closeEditRouteModal() {
    this.showEditRouteModal = false;
  }

  // Add method to edit route
  editRoute() {
    if (!this.editRouteData.origin || !this.editRouteData.destination || this.editRouteData.price <= 0) {
      this.modalService.showError('Validation Error', 'Please fill all fields correctly');
      return;
    }
    this.routeService.updateRoute(this.editRouteData.id!, this.editRouteData).subscribe({
      next: (response) => {
        if (response.success) {
          this.modalService.showSuccess('Success', 'Route updated successfully');
          this.closeEditRouteModal();
          this.loadRoutes();
        } else {
          this.modalService.showError('Error', response.message);
        }
      },
      error: (error) => {
        console.error('Error updating route:', error);
        this.modalService.showError('Error', 'Failed to update route');
      }
    });
  }

  // User Management
  showDeleteUser(user: User) {
    // Show confirmation dialog first
    if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      this.userToDelete = user;
      this.confirmDeleteUser();
    }
  }



  confirmDeleteUser() {
    if (!this.userToDelete) return;

    this.userService.deleteUser(this.userToDelete.id!).subscribe({
      next: (response) => {
        if (response.success) {
          this.modalService.showSuccess('Success', 'User deleted successfully');
          this.userToDelete = null;
          this.loadDashboardData(); // Refresh statistics and all lists
          this.loadDataForMenu(this.activeMenu); // Refresh current menu data
        } else {
          this.modalService.showError('Error', response.message || 'Failed to delete user');
        }
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.modalService.showError('Error', 'Failed to delete user. Please try again.');
      }
    });
  }

  logout() {
    this.modalService.showWarning('Logout', 'Are you sure you want to logout?');
    setTimeout(() => {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }, 2000);
  }

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
      case 'PENDING':
        return 'pending';
      case 'DECLINED':
      case 'FAILED':
        return 'cancelled';
      case 'ACCEPTED':
        return 'in-progress';
      default:
        return '';
    }
  }

  getDisplayRole(role: string): string {
    if (role === 'USER') return 'Customer';
    if (role === 'DRIVER') return 'Driver';
    if (role === 'ADMIN') return 'Admin';
    return role;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
