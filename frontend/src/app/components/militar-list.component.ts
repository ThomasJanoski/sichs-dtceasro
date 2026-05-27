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
    <div class="content-card">
      <div class="loading-overlay" *ngIf="isLoading()">
        <div class="spinner"></div>
        <span>Carregando efetivo...</span>
      </div>

      <header class="card-header">
        <div class="header-info">
          <h2>Gestão de Militares</h2>
          <p>Lista de militares cadastrados no sistema.</p>
        </div>
        <a class="add-btn" routerLink="/dashboard/militares/new">＋ Novo Militar</a>
      </header>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Posto</th>
              <th>Nome Completo</th>
              <th>SARAM</th>
              <th class="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="!isLoading() && militares().length === 0">
              <td colspan="4" class="empty-row">Nenhum militar cadastrado.</td>
            </tr>
            <tr *ngFor="let m of militares()">
              <td><span class="rank-badge">{{ m.posto }}</span></td>
              <td class="font-bold">{{ m.nomecomp }}</td>
              <td class="text-muted">{{ m.saram }}</td>
              <td class="text-right actions-cell">
                <a class="edit-btn" [routerLink]="['/dashboard/militares', id(m), 'edit']">Editar</a>
                <button class="delete-btn" (click)="excluir(m)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .content-card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden; position: relative; min-height: 300px; }
    .loading-overlay { position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(255,255,255,0.8); z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
    .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #0066cc; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .card-header { padding: 1.5rem; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; }
    h2 { margin: 0; color: #111827; }
    .add-btn { padding: 0.7rem 1.2rem; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 0.85rem; }
    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 1rem 1.5rem; background: #f9fafb; color: #4b5563; font-size: 0.75rem; text-transform: uppercase; text-align: left; }
    td { padding: 1rem 1.5rem; border-top: 1px solid #f3f4f6; }
    .rank-badge { background: #f3f4f6; color: #374151; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 800; font-size: 0.75rem; }
    .actions-cell { display: flex; gap: 0.5rem; justify-content: flex-end; }
    .edit-btn { background: #fef3c7; color: #92400e; padding: 0.4rem 0.8rem; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 0.8rem; }
    .delete-btn { background: #fee2e2; color: #b91c1c; padding: 0.4rem 0.8rem; border-radius: 6px; border:none; font-weight: 600; font-size: 0.8rem; cursor: pointer; }
    .empty-row { padding: 3rem; text-align: center; color: #9ca3af; }
  `]
})
export class MilitarListComponent {
  militares = signal<any[]>([]);
  isLoading = signal(true);

  constructor(private api: ApiService, private notificationService: NotificationService) {
    this.load();
  }

  id(m: any) { return entityId(m); }

  load() {
    this.isLoading.set(true);
    this.api.getMilitares().subscribe({
      next: (r) => { this.militares.set(r || []); this.isLoading.set(false); },
      error: (error) => { this.isLoading.set(false); this.notificationService.showError(error, 'Erro ao carregar'); }
    });
  }

  excluir(m: any) {
    if (!confirm('Excluir militar?')) return;
    this.api.deleteMilitar(this.id(m)).subscribe({
      next: () => { this.notificationService.showSuccess('Removido', 'Militar removido.'); this.load(); },
      error: (error) => this.notificationService.showError(error, 'Erro ao remover')
    });
  }
}