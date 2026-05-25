import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NotificationService } from '../services/notification.service';
import { entityId } from '../utils/entity-id';

@Component({
  selector: 'militar-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="panel-card" style="padding:1.4rem;">
      <div class="section-head">
        <div>
          <p class="eyebrow">CADASTRO</p>
          <h2>Militares</h2>
          <p class="section-copy">Gerencie os militares cadastrados no sistema.</p>
        </div>
        <a class="primary-btn" routerLink="/dashboard/militares/new">Novo militar</a>
      </div>

      <div class="table-shell">
        <table>
          <thead>
            <tr>
              <th>Posto</th>
              <th>Nome</th>
              <th>SARAM</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody *ngIf="militares().length === 0">
            <tr>
              <td colspan="4">
                <div class="empty-state">Nenhum militar cadastrado.</div>
              </td>
            </tr>
          </tbody>
          <tbody *ngIf="militares().length > 0">
            <tr *ngFor="let m of militares()">
              <td>{{ m.posto }}</td>
              <td>{{ m.nomecomp }}</td>
              <td>{{ m.saram }}</td>
              <td style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                <a class="secondary-btn" [routerLink]="['/dashboard/militares', id(m), 'edit']">Editar</a>
                <button class="danger-btn" type="button" (click)="excluir(m)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class MilitarListComponent {
  militares = signal<any[]>([]);

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
    this.api.getMilitares().subscribe({
      next: (r) => this.militares.set(r || []),
      error: (error) => {
        this.militares.set([]);
        this.notificationService.showError(error, 'Não foi possível carregar os militares');
      },
    });
  }

  excluir(m: any) {
    if (!confirm('Excluir militar?')) {
      return;
    }

    this.api.deleteMilitar(this.id(m)).subscribe({
      next: () => {
        this.notificationService.showSuccess('Militar removido', 'O militar foi removido com sucesso.');
        this.load();
      },
      error: (error) => {
        this.notificationService.showError(error, 'Não foi possível remover o militar');
      },
    });
  }
}
