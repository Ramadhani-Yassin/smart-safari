import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-home',
 standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  services = [
    {
      title: '🚕 Book a Taxi',
      description: 'Find nearby taxis and request a ride instantly.'
    },
    {
      title: '🧍 Become a Driver',
      description: 'Join our platform and earn by driving.'
    },
    {
      title: '📍 Track Ride',
      description: 'Track your trip status and driver’s location in real-time.'
    }
  ];

  constructor(private router: Router) {}

  /**
   * Navigates user to the login page.
   * Can be extended to pass query params if needed.
   */
  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  redirectToSignup(): void {
    this.router.navigate(['/signup']);
  }

  redirectToHome(): void {
    this.router.navigate(['/home']);
  }

  redirectToSupport(): void {
    this.router.navigate(['/support']);
  }

  submitContact(): void {
  // Placeholder logic — real implementation could call an API
  alert('Thank you for contacting Smart Safari!');
  this.router.navigate(['/login']);
}
  submitFeedback(): void {
    // Placeholder logic — real implementation could call an API
    alert('Thank you for your feedback!');
    this.router.navigate(['/login']);

}
}
