import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administration.html',
  styleUrls: ['./administration.css']
})
export class Administration {
  activeMenu = 0;

  constructor(private router: Router, private modalService: ModalService) {}

  setActiveMenu(index: number): void {
    this.activeMenu = index;
  }

  logout() {
    this.modalService.showWarning('Logout', 'Are you sure you want to logout?');
    setTimeout(() => {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }, 2000);
  }
}
