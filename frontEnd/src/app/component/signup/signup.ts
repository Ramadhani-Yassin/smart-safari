import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalService } from '../../services/modal.service';

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
  isLoading = false;
  
  // Validation properties
  nameError: string = '';
  emailError: string = '';
  passwordError: string = '';
  generalError: string = '';

  constructor(private router: Router, private http: HttpClient, private modalService: ModalService) {}

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

  // Clear validation errors when user starts typing
  onNameChange(): void {
    this.nameError = '';
    this.generalError = '';
  }

  onEmailChange(): void {
    this.emailError = '';
    this.generalError = '';
  }

  onPasswordChange(): void {
    this.passwordError = '';
    this.generalError = '';
  }

  onSignup() {
    console.log('Signup method called');
    console.log('Form data:', { name: this.name, email: this.email, password: this.password, isDriver: this.isDriver });
    
    // Clear previous errors
    this.clearErrors();
    
    // Validate form
    if (!this.validateForm()) {
      console.log('Form validation failed');
      return;
    }

    if (this.isLoading) {
      console.log('Already loading');
      return;
    }

    this.isLoading = true;
    console.log('Making API call to register user...');

    const signupData = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.isDriver ? 'DRIVER' : 'USER'
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post('http://localhost:8080/api/users/register', signupData, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Registration response:', response);
          if (response.success) {
            const userType = this.isDriver ? 'driver' : 'user';
            this.modalService.showSuccess('Registration Successful! 🎉', `Welcome to Smart Safari! You've been registered as a ${userType}. Redirecting to login...`);
            this.clearForm();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.generalError = response.message || 'Registration failed. Please try again.';
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.generalError = error.error?.message || 'Network error. Please check your connection and try again.';
          this.isLoading = false;
        }
      });
  }

  private validateForm(): boolean {
    let isValid = true;

    // Validate name
    if (!this.name.trim()) {
      this.nameError = 'Full name is required';
      isValid = false;
    } else if (this.name.trim().length < 2) {
      this.nameError = 'Name must be at least 2 characters long';
      isValid = false;
    }

    // Validate email
    if (!this.email.trim()) {
      this.emailError = 'Email is required';
      isValid = false;
    } else if (!this.isValidEmail(this.email)) {
      this.emailError = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate password
    if (!this.password.trim()) {
      this.passwordError = 'Password is required';
      isValid = false;
    } else if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters long';
      isValid = false;
    } else if (!this.isStrongPassword(this.password)) {
      this.passwordError = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      isValid = false;
    }

    return isValid;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isStrongPassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    return hasUpperCase && hasLowerCase && hasNumbers;
  }

  private clearErrors(): void {
    this.nameError = '';
    this.emailError = '';
    this.passwordError = '';
    this.generalError = '';
  }

  onToggleDriver() {
    this.isDriver = !this.isDriver;
    console.log('Driver status:', this.isDriver);
  }

  private isFormValid(): boolean {
    const isValid = this.name.trim() !== '' && this.email.trim() !== '' && this.password.trim() !== '';
    console.log('Form validation result:', isValid);
    return isValid;
  }

  private clearForm(): void {
    this.name = '';
    this.email = '';
    this.password = '';
    this.isDriver = false;
    this.isLoading = false;
    this.clearErrors();
  }

  getPasswordStrength(): number {
    if (!this.password) return 0;
    
    let strength = 0;
    if (this.password.length >= 8) strength += 25;
    if (/[a-z]/.test(this.password)) strength += 25;
    if (/[A-Z]/.test(this.password)) strength += 25;
    if (/[0-9]/.test(this.password)) strength += 25;
    
    return Math.min(strength, 100);
  }
}
