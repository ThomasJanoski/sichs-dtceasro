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
    <section class="panel-card" style="padding: 1.4rem;">
      <div class="section-head">
        <div>
          <p class="eyebrow">MODULO</p>
          <h2>Leituras</h2>
          <p class="section-copy">Acompanhe e gerencie as leituras de cada hidrometro.</p>
        </div>

        <div style="display:flex; gap:0.75rem; align-items:end; flex-wrap:wrap;">
          <div>
            <label class="field-label">Hidrometro</label>
            <select class="select-input" [value]="tabela()" (change)="onTabela($event)">
              <option *ngFor="let t of tabelas()" [value]="t.tabela">{{ t.label }}</option>
            </select>
          </div>
          <a class="primary-btn" routerLink="/dashboard/leituras/new">Nova leitura</a>
        </div>
      </div>

      <div class="table-shell">
        <table>
          <thead>
            <tr>
              <th>Coletor</th>
              <th>Leitura</th>
              <th>Data</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody *ngIf="leituras().length === 0">
            <tr>
              <td colspan="5">
                <div class="empty-state">Nenhuma leitura encontrada no intervalo selecionado.</div>
              </td>
            </tr>
          </tbody>
          <tbody *ngIf="leituras().length > 0">
            <tr *ngFor="let l of leituras()">
              <td>{{ l.nomecoletor }}</td>
              <td>{{ l.hidrometro }}</td>
              <td>{{ l.datacoleta }} {{ l.horacoleta }}</td>
              <td>{{ l.total }}</td>
              <td>
                <button type="button" class="danger-btn" (click)="excluir(l)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class CaixaListComponent implements OnInit {
  tabelas = signal<{ tabela: string; label: string }[]>([]);
  tabela = signal('hidrometros');
  leituras = signal<any[]>([]);

  constructor(
    private api: ApiService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.api.getHidrometroTabelas().subscribe({
      next: (t) => {
        this.tabelas.set(t);
        if (t.length) {
          this.tabela.set(t[0].tabela);
          this.load();
        }
      },
      error: (error) => {
        this.tabelas.set([]);
        this.notificationService.showError(error, 'Não foi possível carregar os hidrometros');
      },
    });
  }

  onTabela(e: Event) {
    this.tabela.set((e.target as HTMLSelectElement).value);
    this.load();
  }

  load() {
    this.api.getLeituras(this.tabela()).subscribe({
      next: (r) => this.leituras.set(r || []),
      error: (error) => {
        this.leituras.set([]);
        this.notificationService.showError(error, 'Não foi possível carregar as leituras');
      },
    });
  }

  excluir(l: any) {
    if (!confirm('Excluir leitura?')) {
      return;
    }

    this.api.deleteLeitura(this.tabela(), entityId(l)).subscribe({
      next: () => {
        this.notificationService.showSuccess('Leitura removida', 'A leitura foi removida com sucesso.');
        this.load();
      },
      error: (error) => {
        this.notificationService.showError(error, 'Não foi possível remover a leitura');
      },
    });
  }
}
