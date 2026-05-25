import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'dashboard-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <section class="dashboard-shell">
      <aside class="sidebar">
        <div>
          <div class="brand-block">
            <div class="brand-mark">S</div>
            <div>
              <p class="eyebrow">SICHS</p>
              <h1>DTCEA-SRO</h1>
            </div>
          </div>

          <p class="sidebar-copy">
            Uma visão moderna do controle de leituras, militares e relatórios.
          </p>

          <nav class="nav-stack">
            <a routerLink="leituras" routerLinkActive="active">Leituras</a>
            <a routerLink="leituras/new" routerLinkActive="active">Nova leitura</a>
            <a routerLink="militares" routerLinkActive="active">Militares</a>
            <a routerLink="relatorio" routerLinkActive="active">Relatório PDF</a>
          </nav>
        </div>

        <div class="sidebar-footer">
          <span>Usuário</span>
          <strong>{{ auth.userName || 'Operador' }}</strong>
        </div>
      </aside>

      <main class="content-area">
        <header class="topbar panel-card">
          <div>
            <p class="eyebrow">Bem-vindo</p>
            <h2>{{ auth.userName || 'Operador' }}</h2>
            <p class="section-copy">Acesse os módulos e acompanhe o fluxo do dia.</p>
          </div>

          <div class="topbar-actions">
            <div class="status-pill">Operação online</div>
            <button class="secondary-btn" type="button" (click)="auth.logout()">Sair</button>
          </div>
        </header>

        <section class="hero-card panel-card">
          <div>
            <p class="eyebrow">Resumo</p>
            <h3>Controle centralizado</h3>
            <p class="section-copy">
              Gestão de leitura, cadastro de militares e emissão de relatórios em um único painel.
            </p>
          </div>

          <div class="metric-grid">
            <div class="metric-card">
              <span>Leituras</span>
              <strong>Ativas</strong>
            </div>
            <div class="metric-card">
              <span>Militares</span>
              <strong>Gestão</strong>
            </div>
            <div class="metric-card">
              <span>Relatórios</span>
              <strong>PDF</strong>
            </div>
          </div>
        </section>

        <section class="content-frame">
          <router-outlet></router-outlet>
        </section>
      </main>
    </section>
  `,
  styles: [
    `
      .dashboard-shell {
        display: grid;
        grid-template-columns: 280px minmax(0, 1fr);
        gap: 1rem;
        min-height: 100vh;
        padding: 1rem;
      }

      .sidebar {
        background: rgba(15, 23, 42, 0.88);
        border-radius: 28px;
        padding: 1.4rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.35);
        position: sticky;
        top: 1rem;
        height: calc(100vh - 2rem);
      }

      .brand-block {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        margin-bottom: 1rem;
      }

      .brand-block h1 {
        margin: 0;
        font-size: 1.2rem;
        color: #fff;
      }

      .brand-mark {
        width: 2.8rem;
        height: 2.8rem;
        border-radius: 16px;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #38bdf8, #0ea5e9);
        color: #fff;
        font-weight: 900;
      }

      .sidebar-copy {
        color: #cbd5e1;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }

      .nav-stack {
        display: grid;
        gap: 0.75rem;
      }

      .nav-stack a {
        color: #e2e8f0;
        padding: 0.9rem 1rem;
        border-radius: 16px;
        font-weight: 700;
        transition: background 0.2s ease;
      }

      .nav-stack a:hover,
      .nav-stack a.active {
        background: rgba(56, 189, 248, 0.18);
        color: #fff;
      }

      .sidebar-footer {
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(148, 163, 184, 0.2);
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        color: #cbd5e1;
      }

      .content-area {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .topbar {
        padding: 1.35rem 1.4rem;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: center;
      }

      .topbar h2 {
        margin: 0;
        color: #0f172a;
      }

      .topbar-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .status-pill {
        padding: 0.65rem 1rem;
        border-radius: 999px;
        background: rgba(52, 211, 153, 0.12);
        color: #047857;
        font-weight: 800;
      }

      .hero-card {
        padding: 1.4rem;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: center;
      }

      .hero-card h3 {
        margin: 0;
        color: #0f172a;
      }

      .metric-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(120px, 1fr));
        gap: 0.75rem;
      }

      .metric-card {
        border-radius: 18px;
        padding: 1rem;
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(14, 165, 233, 0.18));
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        color: #0f172a;
      }

      .metric-card span {
        font-size: 0.9rem;
        color: #475569;
      }

      .metric-card strong {
        font-size: 1.05rem;
      }

      .content-frame {
        display: block;
      }

      @media (max-width: 980px) {
        .dashboard-shell {
          grid-template-columns: 1fr;
        }

        .sidebar {
          height: auto;
          position: static;
        }

        .hero-card {
          flex-direction: column;
          align-items: flex-start;
        }

        .metric-grid {
          width: 100%;
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DashboardComponent {
  constructor(public auth: AuthService) {}
}
