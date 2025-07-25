import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-support',
  imports: [],
  templateUrl: './support.html',
  styleUrl: './support.css'
})
export class Support {
  constructor(private router: Router) {}

  redirectToHome(): void {
    this.router.navigate(['/home']);
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  redirectToSupport(): void {
    this.router.navigate(['/support']);
  }
}
