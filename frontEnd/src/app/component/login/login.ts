import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private readonly validEmail: string = 'test@example.com';
  private readonly validPassword: string = 'test123';

  email: string = '';
  password: string = '';
  isDriver: boolean = false;
  isLoading: boolean = false;

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

  onSubmit(): void {
    if (this.isLoading || !this.isFormValid()) {
      return;
    }

    this.isLoading = true;

    if (this.email === this.validEmail && this.password === this.validPassword) {
      alert('You have logged in successfully!');
      this.clearForm();
      
      setTimeout(() => {
        this.router.navigate(['/profile']);
      }, 2000);
    } else {
      alert('Invalid Email or Password. Please retry!');
      this.isLoading = false;
    }
  }

  private clearForm(): void {
    this.email = '';
    this.password = '';
    this.isDriver = false;
    this.isLoading = false;
  }

  private isFormValid(): boolean {
    return this.email.trim() !== '' && this.password.trim() !== '';
  }
}