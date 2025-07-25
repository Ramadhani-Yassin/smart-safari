import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  name = '';
  email = '';
  password = '';
  isDriver = false;

  constructor(private router: Router) {}

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

  onSignup() {
    console.log('Name:', this.name);
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('Driver?', this.isDriver);
  }
  onToggleDriver() {
    this.isDriver = !this.isDriver;
    console.log('Driver status:', this.isDriver);
  }
}
