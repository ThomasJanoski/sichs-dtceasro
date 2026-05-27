import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'relatorio-hidrometro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="content-card mini-card">
      <div class="loading-overlay" *ngIf="isLoading()">
        <div class="spinner"></div>
      </div>

      <header class="card-header text-center">
        <span class="report-icon">📄</span>
        <h2>Emissão de Relatório</h2>
        <p>Selecione o período para gerar o PDF</p>
      </header>

      <form [formGroup]="form" (ngSubmit)="gerar()" class="form-body">
        <div class="field">
          <label>Hidrômetro</label>
          <select formControlName="tabela">
            <option *ngFor="let t of tabelas()" [value]="t.tabela">{{ t.label }}</option>
          </select>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Data Inicial</label>
            <input type="date" formControlName="datainicio" />
          </div>
          <div class="field">
            <label>Data Final</label>
            <input type="date" formControlName="datafinal" />
          </div>
        </div>
        <button type="submit" class="print-btn" [disabled]="form.invalid || isLoading()">
          <span>🖨️</span> Gerar Relatório PDF
        </button>
      </form>
    </div>
  `,
  styles: [`
    .mini-card { max-width: 500px; margin: 0 auto; position: relative; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .loading-overlay { position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(255,255,255,0.8); z-index: 10; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
    .spinner { width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #4f46e5; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .text-center { text-align: center; }
    .report-icon { font-size: 3rem; display: block; margin: 1rem 0; }
    .card-header { padding: 1.5rem; border-bottom: 1px solid #f3f4f6; }
    .form-body { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .field { display: flex; flex-direction: column; gap: 0.4rem; }
    label { font-weight: 700; font-size: 0.75rem; color: #4b5563; }
    input, select { padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; }
    .print-btn { padding: 1rem; background: #4f46e5; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
    .print-btn:disabled { opacity: 0.5; }
  `]
})
export class RelatorioComponent implements OnInit {
  form: FormGroup;
  tabelas = signal<{ tabela: string; label: string }[]>([]);
  isLoading = signal(true);

  constructor(private fb: FormBuilder, private api: ApiService, private notificationService: NotificationService) {
    this.form = fb.group({
      tabela: ['hidrometros', Validators.required],
      datainicio: ['', Validators.required],
      datafinal: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.api.getHidrometroTabelas().subscribe({
      next: (t) => { this.tabelas.set(t); this.isLoading.set(false); },
      error: (e) => { this.isLoading.set(false); this.notificationService.showError(e, 'Erro'); }
    });
  }

  gerar() {
    const v = this.form.value;
    window.open(this.api.getRelatorioPdfUrl(v.tabela, v.datainicio, v.datafinal), '_blank');
  }
}