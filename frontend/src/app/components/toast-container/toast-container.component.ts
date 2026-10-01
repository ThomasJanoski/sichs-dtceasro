import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ToastContainerComponent {
  private readonly notificationService = inject(NotificationService);
  readonly toasts = this.notificationService.items;

  dismiss(id: number) {
    this.notificationService.dismiss(id);
  }
}