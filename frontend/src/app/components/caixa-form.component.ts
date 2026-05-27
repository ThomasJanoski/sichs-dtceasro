import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'leitura-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="content-card">
      <header class="card-header">
        <h2>Registrar Nova Leitura</h2>
        <p>Informe os dados abaixo para calcular o consumo do período.</p>
      </header>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form-body">
        <div class="grid-form">
          <div class="field">
            <label>Hidrômetro</label>
            <select formControlName="tabela" (change)="carregarUltima()">
              <option *ngFor="let t of tabelas()" [value]="t.tabela">{{ t.label }}</option>
            </select>
          </div>

          <div class="field">
            <label>Militar Coletor</label>
            <select formControlName="nomecoletor">
              <option value="">Selecione um militar...</option>
              <option *ngFor="let m of militares()" [value]="labelMilitar(m)">{{ labelMilitar(m) }}</option>
            </select>
          </div>

          <div class="field">
            <label>Leitura Atual (m³)</label>
            <input type="text" formControlName="hidrometro" placeholder="Ex: 1250.45" (input)="calcular()" />
          </div>

          <div class="field">
            <label>Consumo Calculado (m³)</label>
            <input type="text" formControlName="total" readonly class="readonly-input" />
          </div>

          <div class="field">
            <label>Data da Coleta</label>
            <input type="date" formControlName="datacoleta" />
          </div>

          <div class="field">
            <label>Hora da Coleta</label>
            <input type="time" formControlName="horacoleta" />
          </div>
        </div>

        <div class="field full-width">
          <label>Observações</label>
          <textarea formControlName="observacoes" rows="3" placeholder="Ocorrências ou notas sobre o hidrômetro..."></textarea>
        </div>

        <footer class="form-actions">
          <button type="submit" class="save-btn" [disabled]="form.invalid">Salvar Registro</button>
          <button type="button" class="cancel-btn" (click)="router.navigate(['/dashboard/leituras'])">Cancelar</button>
        </footer>
      </form>
    </div>
  `,
  styles: [`
    .content-card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    
    .card-header { padding: 1.5rem; border-bottom: 1px solid #f3f4f6; }
    .card-header h2 { margin: 0; color: #111827; }
    .card-header p { margin: 0.25rem 0 0; color: #6b7280; font-size: 0.9rem; }

    .form-body { padding: 2rem; }

    .grid-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .field { display: flex; flex-direction: column; gap: 0.5rem; }
    .full-width { margin-top: 1.5rem; }

    label { font-weight: 700; font-size: 0.85rem; color: #4b5563; text-transform: uppercase; }

    input, select, textarea {
      padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px;
      font-size: 1rem; transition: border-color 0.2s;
    }

    input:focus, select:focus, textarea:focus { outline: none; border-color: #0066cc; }

    .readonly-input { background-color: #f3f4f6; color: #0066cc; font-weight: 800; border-style: dashed; }

    .form-actions {
      margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #f3f4f6;
      display: flex; gap: 1rem;
    }

    .save-btn {
      padding: 0.8rem 2rem; background: #0066cc; color: white;
      border: none; border-radius: 8px; font-weight: 700; cursor: pointer;
    }

    .cancel-btn {
      padding: 0.8rem 2rem; background: #f3f4f6; color: #4b5563;
      border: none; border-radius: 8px; font-weight: 700; cursor: pointer;
    }

    .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .save-btn:hover:not(:disabled) { background: #0052a3; transform: translateY(-2px); }
  `]
})

export class CaixaFormComponent implements OnInit {
  form: FormGroup;
  tabelas = signal<{ tabela: string; label: string }[]>([]);
  militares = signal<any[]>([]);
  ultima = 0;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private notificationService: NotificationService,
    public router: Router,
  ) {
    this.form = this.fb.group({
      tabela: ['hidrometros', Validators.required],
      nomecoletor: ['', Validators.required],
      hidrometro: ['', Validators.required],
      datacoleta: ['', Validators.required],
      horacoleta: ['', Validators.required],
      total: ['', Validators.required],
      observacoes: [''],
      hid_cal: [''],
    });
  }

  ngOnInit() {
    this.api.getHidrometroTabelas().subscribe({
      next: (t) => this.tabelas.set(t),
      error: (error) => {
        this.tabelas.set([]);
        this.notificationService.showError(error, 'Não foi possível carregar os hidrometros');
      },
    });

    this.api.getMilitares().subscribe({
      next: (m) => this.militares.set(m || []),
      error: (error) => {
        this.militares.set([]);
        this.notificationService.showError(error, 'Não foi possível carregar os militares');
      },
    });

    this.carregarUltima();
  }

  labelMilitar(m: any) {
    return `${m.posto ?? ''} ${m.nomecomp ?? ''}`.trim();
  }

  carregarUltima() {
    this.api.getUltimaLeitura(this.form.value.tabela).subscribe({
      next: (r) => {
        this.ultima = parseFloat(String(r.valor).replace(',', '.')) || 0;
        this.calcular();
      },
      error: (error) => {
        this.ultima = 0;
        this.calcular();
        this.notificationService.showError(error, 'Não foi possível carregar a última leitura');
      },
    });
  }

  calcular() {
    const atual = parseFloat(String(this.form.value.hidrometro).replace(',', '.')) || 0;
    const total = Math.max(0, atual - this.ultima);

    this.form.patchValue({
      total: total.toFixed(3),
      hid_cal: String(this.ultima),
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const { tabela, ...payload } = this.form.value;
    this.api.createLeitura(tabela, payload).subscribe({
      next: () => {
        this.notificationService.showSuccess('Leitura salva', 'A leitura foi registrada com sucesso.');
        this.router.navigate(['/dashboard/leituras']);
      },
      error: (error) => {
        this.notificationService.showError(error, 'Não foi possível salvar a leitura');
      },
    });
  }
}
