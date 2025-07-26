import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-dashboard.html',
  styleUrl: './driver-dashboard.css'
})
export class DriverDashboard {
  sidebarCollapsed = false;
  activeMenu = 0;

  menu = [
    { label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { label: 'Active Rides', icon: 'fas fa-car' },
    { label: 'Earnings', icon: 'fas fa-money-bill-wave' },
    { label: 'Profile', icon: 'fas fa-user' }
  ];

  driver = {
    name: 'Ali Said',
    email: 'ali.said@email.com',
    phone: '+255 123 456 789',
    rating: 4.7,
    totalTrips: 130,
    vehicle: 'Toyota Vitz',
    licensePlate: 'Z123ABC',
    avatar: 'https://i.pravatar.cc/150?img=12',
    isOnline: true,
    earnings: 45.50,
    onlineHours: 6.5
  };

  rideRequests = [
    { 
      id: 1, 
      passenger: 'Fatma Hassan', 
      passengerAvatar: 'https://i.pravatar.cc/150?img=1',
      passengerRating: 4.8,
      pickup: 'Stone Town', 
      destination: 'Chukwani',
      fare: '$12.50',
      time: '2 min ago'
    },
    { 
      id: 2, 
      passenger: 'Hamza Ali', 
      passengerAvatar: 'https://i.pravatar.cc/150?img=2',
      passengerRating: 4.9,
      pickup: 'Mazizini', 
      destination: 'SUZA Tunguu',
      fare: '$18.00',
      time: '5 min ago'
    },
    { 
      id: 3, 
      passenger: 'Zuberi Mwinyi', 
      passengerAvatar: 'https://i.pravatar.cc/150?img=3',
      passengerRating: 4.7,
      pickup: 'Kisauni', 
      destination: 'Fumba',
      fare: '$25.00',
      time: '8 min ago'
    }
  ];

  activeRides = [
    {
      id: 1,
      passenger: 'Aisha Omar',
      passengerAvatar: 'https://i.pravatar.cc/150?img=4',
      phone: '+255 987 654 321',
      pickup: 'Posta',
      destination: 'Magomeni',
      startTime: '10:30 AM',
      fare: '$8.50',
      status: 'accepted'
    }
  ];

  notifications = [
    { id: 1, message: 'New ride request from Stone Town', time: '2 min ago' },
    { id: 2, message: 'Payment received for ride #123', time: '15 min ago' }
  ];

  weeklyEarnings = 245.75;
  monthlyEarnings = 892.30;
  earningsProgress = 45.5;

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
      'Monitor your ride requests and earnings',
      'Manage your active rides and passengers',
      'Track your earnings and financial goals',
      'Update your profile and preferences'
    ];
    return descriptions[this.activeMenu] || '';
  }

  toggleStatus() {
    const status = this.driver.isOnline ? 'online' : 'offline';
    this.modalService.showInfo('Status Updated', `You are now ${status} and ${status === 'online' ? 'ready to accept rides' : 'no longer receiving ride requests'}.`);
  }

  acceptRide(requestId: number) {
    const request = this.rideRequests.find(r => r.id === requestId);
    if (request) {
      this.modalService.showSuccess('Ride Accepted! 🚗', `You've accepted the ride from ${request.passenger}. Head to ${request.pickup} to pick up your passenger.`);
      
      // Move to active rides
      this.activeRides.push({
        id: requestId,
        passenger: request.passenger,
        passengerAvatar: request.passengerAvatar,
        phone: '+255 123 456 789', // Mock phone
        pickup: request.pickup,
        destination: request.destination,
        startTime: new Date().toLocaleTimeString(),
        fare: request.fare,
        status: 'accepted'
      });
      
      // Remove from requests
      this.rideRequests = this.rideRequests.filter(r => r.id !== requestId);
    }
  }

  declineRide(requestId: number) {
    this.rideRequests = this.rideRequests.filter(r => r.id !== requestId);
    this.modalService.showInfo('Ride Declined', 'The ride request has been declined.');
  }

  startRide(rideId: number) {
    const ride = this.activeRides.find(r => r.id === rideId);
    if (ride) {
      ride.status = 'in-progress';
      this.modalService.showSuccess('Ride Started! 🚀', `You're now on your way to ${ride.destination} with ${ride.passenger}.`);
    }
  }

  completeRide(rideId: number) {
    const ride = this.activeRides.find(r => r.id === rideId);
    if (ride) {
      this.modalService.showSuccess('Ride Completed! ✅', `You've successfully completed the ride to ${ride.destination}. Payment of ${ride.fare} has been processed.`);
      this.activeRides = this.activeRides.filter(r => r.id !== rideId);
      
      // Update earnings
      const fareAmount = parseFloat(ride.fare.replace('$', ''));
      this.driver.earnings += fareAmount;
      this.earningsProgress = Math.min(100, (this.driver.earnings / 100) * 100);
    }
  }

  contactPassenger(rideId: number) {
    const ride = this.activeRides.find(r => r.id === rideId);
    if (ride) {
      this.modalService.showInfo('Contact Passenger', `Calling ${ride.passenger} at ${ride.phone}...`);
    }
  }

  logout() {
    this.modalService.showWarning('Logout', 'Are you sure you want to logout? You will go offline and stop receiving ride requests.');
    setTimeout(() => {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }, 2000);
  }
}
