import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      <div *ngFor="let toast of toasts()" class="toast" [ngClass]="toast.type">
        <div>
          <strong>{{ toast.title }}</strong>
          <p>{{ toast.message }}</p>
        </div>

        <button type="button" class="toast-close" (click)="dismiss(toast.id)" aria-label="Fechar mensagem">
          ×
        </button>
      </div>
    </div>
  `,
})
export class ToastContainerComponent {
  private readonly notificationService = inject(NotificationService);

  readonly toasts = this.notificationService.items;

  dismiss(id: number): void {
    this.notificationService.dismiss(id);
  }
}
