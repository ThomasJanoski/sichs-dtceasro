import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="page dashboard-page">
      <header class="topbar">
        <div class="brand-section">
          <span class="brand">🏛️ SICHS</span>
          <span class="subtitle">Bem-vindo, <strong>{{ auth.userName || 'Operador' }}</strong></span>
        </div>
        <div class="topbar-right">
          <span class="status-badge">● Sistema Operacional</span>
          <button type="button" class="logout-btn" (click)="auth.logout()">Sair</button>
        </div>
      </header>

      <section class="actions">
        <a routerLink="leituras" routerLinkActive="active" class="action-btn action-list">
          <span class="icon">📊</span>
          <span class="text">
            <strong>Leituras</strong>
            <small>Consultar histórico</small>
          </span>
        </a>
        <a routerLink="leituras/new" routerLinkActive="active" class="action-btn action-add">
          <span class="icon">➕</span>
          <span class="text">
            <strong>Nova Leitura</strong>
            <small>Registrar medição</small>
          </span>
        </a>
        <a routerLink="militares" routerLinkActive="active" class="action-btn action-militar">
          <span class="icon">🪖</span>
          <span class="text">
            <strong>Militares</strong>
            <small>Gestão de efetivo</small>
          </span>
        </a>
        <a routerLink="relatorio" routerLinkActive="active" class="action-btn action-pdf">
          <span class="icon">📄</span>
          <span class="text">
            <strong>Relatórios</strong>
            <small>Gerar PDF</small>
          </span>
        </a>
      </section>

      <main class="content-view">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .page { min-height: 100vh; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 1.5rem; }
    .topbar { 
      display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; 
      background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(34, 60, 80, 0.1); margin-bottom: 1.5rem;
    }
    .brand-section { display: flex; flex-direction: column; gap: 0.25rem; }
    .brand { font-weight: 800; font-size: 1.3rem; color: #0066cc; }
    .subtitle { color: #6b7280; font-size: 0.9rem; }
    .topbar-right { display: flex; align-items: center; gap: 1.5rem; }
    .status-badge { color: #10b981; font-weight: 700; font-size: 0.85rem; }
    .logout-btn {
      padding: 0.6rem 1.2rem; background: #ef4444; color: white; border: none; 
      border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s;
    }
    .logout-btn:hover { background: #dc2626; transform: translateY(-2px); }
    .actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .action-btn { 
      display: flex; align-items: center; gap: 1rem; text-decoration: none; padding: 1.25rem; 
      border-radius: 12px; background: white; color: #1f2937; border: 2px solid #e5e7eb; transition: all 0.3s ease;
    }
    .action-btn:hover, .action-btn.active { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); border-color: transparent; }
    .action-list { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-color: #93c5fd; }
    .action-add { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-color: #6ee7b7; }
    .action-militar { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-color: #fcd34d; }
    .action-pdf { background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border-color: #a5b4fc; }
    .action-btn .icon { font-size: 1.8rem; }
    .action-btn .text { display: flex; flex-direction: column; }
    .action-btn strong { font-size: 1rem; }
    .action-btn small { color: #9ca3af; font-size: 0.8rem; }
    @media (max-width: 768px) { .topbar { flex-direction: column; text-align: center; gap: 1rem; } .actions { grid-template-columns: 1fr; } }
  `]
})
export class DashboardComponent {
  constructor(public auth: AuthService) {}
}