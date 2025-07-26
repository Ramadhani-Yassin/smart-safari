import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ModalData {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  show: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new Subject<ModalData>();
  modal$ = this.modalSubject.asObservable();

  showSuccess(title: string, message: string) {
    this.showModal('success', title, message);
  }

  showError(title: string, message: string) {
    this.showModal('error', title, message);
  }

  showInfo(title: string, message: string) {
    this.showModal('info', title, message);
  }

  showWarning(title: string, message: string) {
    this.showModal('warning', title, message);
  }

  hideModal() {
    this.modalSubject.next({ type: 'info', title: '', message: '', show: false });
  }

  private showModal(type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) {
    this.modalSubject.next({ type, title, message, show: true });
  }
} 