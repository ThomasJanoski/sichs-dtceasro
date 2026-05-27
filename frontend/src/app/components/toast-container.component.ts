import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrapper">
      <div *ngFor="let toast of toasts()" class="toast-item" [ngClass]="toast.type">
        <span class="toast-icon">{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        <div class="toast-content">
          <strong>{{ toast.title }}</strong>
          <p>{{ toast.message }}</p>
        </div>
        <button class="close-toast" (click)="dismiss(toast.id)">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-wrapper { position: fixed; top: 1.5rem; right: 1.5rem; z-index: 9999; display: flex; flex-direction: column; gap: 0.75rem; }
    .toast-item { width: 320px; padding: 1rem; border-radius: 12px; background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.15); display: flex; gap: 0.75rem; border-left: 6px solid #d1d5db; animation: slide 0.3s ease; }
    @keyframes slide { from { transform: translateX(100%); } to { transform: translateX(0); } }
    .toast-item.success { border-left-color: #10b981; }
    .toast-item.error { border-left-color: #ef4444; }
    .toast-content strong { display: block; font-size: 0.9rem; }
    .toast-content p { margin: 0; font-size: 0.8rem; color: #6b7280; }
    .close-toast { background: none; border: none; margin-left: auto; cursor: pointer; color: #9ca3af; }
  `]
})
export class ToastContainerComponent {
  private readonly notificationService = inject(NotificationService);
  readonly toasts = this.notificationService.items;
  dismiss(id: number) { this.notificationService.dismiss(id); }
}