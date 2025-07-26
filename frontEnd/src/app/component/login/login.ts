import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email: string = '';
  password: string = '';
  isDriver: boolean = false;
  isLoading: boolean = false;
  
  // Validation properties
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
  onEmailChange(): void {
    this.emailError = '';
    this.generalError = '';
  }

  onPasswordChange(): void {
    this.passwordError = '';
    this.generalError = '';
  }

  onSubmit(): void {
    // Clear previous errors
    this.clearErrors();
    
    // Validate form
    if (!this.validateForm()) {
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    const loginData = {
      email: this.email,
      password: this.password
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post('http://localhost:8080/api/users/login', loginData, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.modalService.showSuccess('Login Successful! 🎉', `Welcome back! Redirecting you to your dashboard...`);
            // Store user data in localStorage or session
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            this.clearForm();
            
            // Check user role and redirect accordingly
            const user = response.data;
            setTimeout(() => {
              if (user.role === 'DRIVER') {
                this.router.navigate(['/driver-dashboard']);
              } else if (user.role === 'ADMIN') {
                this.router.navigate(['/admin']);
              } else {
                this.router.navigate(['/dashboard']);
              }
            }, 2000);
          } else {
            this.generalError = response.message || 'Invalid credentials. Please try again.';
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.generalError = error.error?.message || 'Network error. Please check your connection and try again.';
          this.isLoading = false;
        }
      });
  }

  private validateForm(): boolean {
    let isValid = true;

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
    } else if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters long';
      isValid = false;
    }

    return isValid;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private clearErrors(): void {
    this.emailError = '';
    this.passwordError = '';
    this.generalError = '';
  }

  private clearForm(): void {
    this.email = '';
    this.password = '';
    this.isDriver = false;
    this.isLoading = false;
    this.clearErrors();
  }

  private isFormValid(): boolean {
    return this.email.trim() !== '' && this.password.trim() !== '';
  }
}