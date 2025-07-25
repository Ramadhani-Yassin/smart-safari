import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-dashboard.html',
  styleUrl: './driver-dashboard.css'
})
export class DriverDashboard {
  driver = {
    name: 'Ali Said',
    rating: 4.7,
    totalTrips: 130,
    vehicle: 'Toyota Vitz - Z123ABC'
  };

  rideRequests = [
    { id: 1, passenger: 'Fatma', pickup: 'Stone Town', destination: 'Chukwani' },
    { id: 2, passenger: 'Hamza', pickup: 'Mazizini', destination: 'SUZA Tunguu' },
    { id: 3, passenger: 'Zuberi', pickup: 'Kisauni', destination: 'Fumba' }
  ];

  acceptRide(requestId: number) {
    alert(`✅ Ride request #${requestId} accepted.`);
    this.rideRequests = this.rideRequests.filter(r => r.id !== requestId);
  }

}
