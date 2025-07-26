import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalService, ModalData } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="modalData.show" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header" [ngClass]="modalData.type">
          <div class="modal-icon">
            <i [class]="getIconClass()"></i>
          </div>
          <h3>{{ modalData.title }}</h3>
          <button class="close-btn" (click)="closeModal()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ modalData.message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" (click)="closeModal()">
            {{ modalData.type === 'success' ? 'Continue' : 'OK' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      width: 90%;
      animation: slideIn 0.3s ease;
    }

    .modal-header {
      padding: 20px 20px 0 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .modal-header.success {
      border-bottom: 3px solid #00e676;
    }

    .modal-header.error {
      border-bottom: 3px solid #ff5252;
    }

    .modal-header.info {
      border-bottom: 3px solid #2979ff;
    }

    .modal-header.warning {
      border-bottom: 3px solid #ffd600;
    }

    .modal-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .modal-header.success .modal-icon {
      background: #00e676;
      color: white;
    }

    .modal-header.error .modal-icon {
      background: #ff5252;
      color: white;
    }

    .modal-header.info .modal-icon {
      background: #2979ff;
      color: white;
    }

    .modal-header.warning .modal-icon {
      background: #ffd600;
      color: #1a237e;
    }

    .modal-header h3 {
      margin: 0;
      flex: 1;
      font-size: 18px;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #666;
      padding: 5px;
      border-radius: 50%;
      transition: background 0.2s;
    }

    .close-btn:hover {
      background: #f5f5f5;
    }

    .modal-body {
      padding: 20px;
    }

    .modal-body p {
      margin: 0;
      color: #333;
      line-height: 1.5;
    }

    .modal-footer {
      padding: 0 20px 20px 20px;
      text-align: right;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #2979ff;
      color: white;
    }

    .btn-primary:hover {
      background: #1a237e;
      transform: translateY(-1px);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class ModalComponent implements OnInit, OnDestroy {
  modalData: ModalData = { type: 'info', title: '', message: '', show: false };
  private subscription: Subscription = new Subscription();

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.subscription = this.modalService.modal$.subscribe(data => {
      this.modalData = data;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeModal() {
    this.modalService.hideModal();
  }

  getIconClass(): string {
    switch (this.modalData.type) {
      case 'success': return 'fas fa-check';
      case 'error': return 'fas fa-exclamation-triangle';
      case 'info': return 'fas fa-info-circle';
      case 'warning': return 'fas fa-exclamation-circle';
      default: return 'fas fa-info-circle';
    }
  }
} 