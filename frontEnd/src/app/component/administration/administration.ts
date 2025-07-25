import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administration.html',
  styleUrls: ['./administration.css']
})
export class Administration {
  activeMenu = 0;

  setActiveMenu(index: number): void {
    this.activeMenu = index;
  }
}
