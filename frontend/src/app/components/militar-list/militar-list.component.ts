import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { entityId } from '../../utils/entity-id';

@Component({
  selector: 'militar-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './militar-list.component.html',
  styleUrl: './militar-list.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MilitarListComponent {
  militares = signal<any[]>([]);
  isLoading = signal(true);

  constructor(
    private api: ApiService,
    private notificationService: NotificationService,
  ) {
    this.load();
  }

  id(m: any) {
    return entityId(m);
  }

  load() {
    this.isLoading.set(true);
    this.api.getMilitares().subscribe({
      next: (r) => {
        this.militares.set(r || []);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notificationService.showError(error, 'Erro ao carregar');
      },
    });
  }

  excluir(m: any) {
    if (!confirm('Excluir militar?')) return;
    this.api.deleteMilitar(this.id(m)).subscribe({
      next: () => {
        this.notificationService.showSuccess('Removido', 'Militar removido.');
        this.load();
      },
      error: (error) => this.notificationService.showError(error, 'Erro ao remover'),
    });
  }
}