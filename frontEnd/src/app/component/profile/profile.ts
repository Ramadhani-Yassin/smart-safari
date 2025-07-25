import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  user = {
    name: 'John Doe',
    email: 'user@example.com',
    isDriver: false,
    avatar: 'https://i.pravatar.cc/150?img=12',
    stats: {
      trips: 24,
      rating: 4.8,
      memberSince: '2023'
    }
  };

  constructor(private router: Router) {}

  logout(): void {
    // Add logic to clear session/token here
    this.router.navigate(['/']);
  }

  goToBooking(): void {
    this.router.navigate(['/booking']);
  }

  viewTrips(): void {
    this.router.navigate(['/map']);
  }

}
