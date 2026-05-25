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
    <section class="panel-card" style="padding: 1.4rem;">
      <div class="section-head">
        <div>
          <p class="eyebrow">CADASTRO</p>
          <h2>Nova leitura</h2>
          <p class="section-copy">Registre o valor atual do hidrometro e calcule o consumo.</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem;">
          <div>
            <label class="field-label">Hidrometro</label>
            <select class="select-input" formControlName="tabela" (change)="carregarUltima()">
              <option *ngFor="let t of tabelas()" [value]="t.tabela">{{ t.label }}</option>
            </select>
          </div>

          <div>
            <label class="field-label">Coletor</label>
            <select class="select-input" formControlName="nomecoletor">
              <option value="">Selecione</option>
              <option *ngFor="let m of militares()" [value]="labelMilitar(m)">{{ labelMilitar(m) }}</option>
            </select>
          </div>

          <div>
            <label class="field-label">Leitura atual (m3)</label>
            <input class="select-input" formControlName="hidrometro" (input)="calcular()" />
          </div>

          <div>
            <label class="field-label">Total gasto (m3)</label>
            <input class="select-input" formControlName="total" readonly />
          </div>

          <div>
            <label class="field-label">Data</label>
            <input class="select-input" type="date" formControlName="datacoleta" />
          </div>

          <div>
            <label class="field-label">Hora</label>
            <input class="select-input" type="time" formControlName="horacoleta" />
          </div>
        </div>

        <div style="margin-top:1rem;">
          <label class="field-label">Observações</label>
          <textarea class="select-input" formControlName="observacoes" rows="3"></textarea>
        </div>

        <div style="display:flex; gap:0.75rem; margin-top:1.5rem; flex-wrap:wrap;">
          <button class="primary-btn" type="submit" [disabled]="form.invalid">Salvar</button>
          <button class="secondary-btn" type="button" (click)="router.navigate(['/dashboard/leituras'])">Cancelar</button>
        </div>
      </form>
    </section>
  `,
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
