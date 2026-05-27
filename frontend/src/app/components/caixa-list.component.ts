import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NotificationService } from '../services/notification.service';
import { entityId } from '../utils/entity-id';

@Component({
  selector: 'leitura-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="content-card">
      <div class="loading-overlay" *ngIf="isLoading()">
        <div class="spinner"></div>
        <span>Carregando medições...</span>
      </div>

      <header class="card-header">
        <div class="header-info">
          <h2>Histórico de Leituras</h2>
          <p>Selecione o hidrômetro para listar as medições</p>
        </div>
        <div class="header-controls">
          <div class="select-wrapper">
            <label>Hidrômetro</label>
            <select [value]="tabela()" (change)="onTabela($event)">
              <option *ngFor="let t of tabelas()" [value]="t.tabela">{{ t.label }}</option>
            </select>
          </div>
          <a class="add-btn" routerLink="/dashboard/leituras/new">＋ Novo Registro</a>
        </div>
      </header>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Coletor</th>
              <th>Leitura (m³)</th>
              <th>Data/Hora</th>
              <th>Consumo</th>
              <th class="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="!isLoading() && leituras().length === 0">
              <td colspan="5" class="empty-row">Nenhuma leitura encontrada.</td>
            </tr>
            <tr *ngFor="let l of leituras()">
              <td class="font-bold">{{ l.nomecoletor }}</td>
              <td>{{ l.hidrometro }}</td>
              <td class="text-muted">{{ l.datacoleta }} <small>{{ l.horacoleta }}</small></td>
              <td><span class="consumption-tag">{{ l.total }} m³</span></td>
              <td class="text-right">
                <button class="delete-btn" (click)="excluir(l)">Remover</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .content-card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden; position: relative; min-height: 400px;}
    .loading-overlay { position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(255,255,255,0.8); z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
    .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #0066cc; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .card-header { padding: 1.5rem; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; }
    .header-controls { display: flex; gap: 1rem; align-items: flex-end; }
    .select-wrapper { display: flex; flex-direction: column; gap: 0.4rem; }
    .select-wrapper label { font-size: 0.7rem; font-weight: 800; color: #4b5563; text-transform: uppercase; }
    select { padding: 0.6rem; border-radius: 8px; border: 1px solid #d1d5db; background: #f9fafb; min-width: 180px; }
    .add-btn { padding: 0.7rem 1.2rem; background: #0066cc; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 0.85rem; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 1rem 1.5rem; background: #f9fafb; color: #4b5563; font-size: 0.75rem; text-transform: uppercase; text-align: left; }
    td { padding: 1rem 1.5rem; border-top: 1px solid #f3f4f6; }
    .consumption-tag { background: #e0f2fe; color: #0369a1; padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem; }
    .delete-btn { padding: 0.4rem 0.8rem; background: #fee2e2; color: #b91c1c; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
    .text-right { text-align: right; }
    .empty-row { padding: 4rem; text-align: center; color: #9ca3af; }
  `]
})
export class CaixaListComponent implements OnInit {
  tabelas = signal<{ tabela: string; label: string }[]>([]);
  tabela = signal('hidrometros');
  leituras = signal<any[]>([]);
  isLoading = signal(true);

  constructor(private api: ApiService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.api.getHidrometroTabelas().subscribe({
      next: (t) => {
        this.tabelas.set(t);
        if (t.length) { this.tabela.set(t[0].tabela); this.load(); }
      },
      error: (e) => this.notificationService.showError(e, 'Erro ao carregar tabelas')
    });
  }

  onTabela(e: Event) { this.tabela.set((e.target as HTMLSelectElement).value); this.load(); }

  load() {
    this.isLoading.set(true);
    this.api.getLeituras(this.tabela()).subscribe({
      next: (r) => { this.leituras.set(r || []); this.isLoading.set(false); },
      error: (e) => { this.isLoading.set(false); this.notificationService.showError(e, 'Erro ao carregar leituras'); }
    });
  }

  excluir(l: any) {
    if (!confirm('Excluir?')) return;
    this.api.deleteLeitura(this.tabela(), entityId(l)).subscribe({
      next: () => { this.notificationService.showSuccess('OK', 'Removido.'); this.load(); },
      error: (e) => this.notificationService.showError(e, 'Erro')
    });
  }
}