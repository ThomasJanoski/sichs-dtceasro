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
    <section class="panel-card" style="padding:1.4rem; max-width:640px;">
      <div class="section-head">
        <div>
          <p class="eyebrow">RELATÓRIO</p>
          <h2>Gerar PDF</h2>
          <p class="section-copy">Selecione o hidrometro e o intervalo para emitir o relatório.</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="gerar()">
        <div style="display:grid; gap:1rem;">
          <div>
            <label class="field-label">Hidrometro</label>
            <select class="select-input" formControlName="tabela">
              <option *ngFor="let t of tabelas()" [value]="t.tabela">{{ t.label }}</option>
            </select>
          </div>

          <div>
            <label class="field-label">Data inicial</label>
            <input class="select-input" type="date" formControlName="datainicio" />
          </div>

          <div>
            <label class="field-label">Data final</label>
            <input class="select-input" type="date" formControlName="datafinal" />
          </div>
        </div>

        <button class="primary-btn" type="submit" [disabled]="form.invalid" style="margin-top:1.4rem;">
          Gerar PDF
        </button>
      </form>
    </section>
  `,
})
export class RelatorioComponent implements OnInit {
  form: FormGroup;
  tabelas = signal<{ tabela: string; label: string }[]>([]);

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private notificationService: NotificationService,
  ) {
    this.form = fb.group({
      tabela: ['hidrometros', Validators.required],
      datainicio: ['', Validators.required],
      datafinal: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.api.getHidrometroTabelas().subscribe({
      next: (t) => {
        this.tabelas.set(t);
        if (t.length) {
          this.form.patchValue({ tabela: t[0].tabela });
        }
      },
      error: (error) => {
        this.tabelas.set([]);
        this.notificationService.showError(error, 'Não foi possível carregar os hidrometros');
      },
    });
  }

  gerar() {
    if (this.form.invalid) {
      return;
    }

    const v = this.form.value;
    window.open(this.api.getRelatorioPdfUrl(v.tabela, v.datainicio, v.datafinal), '_blank');
  }
}
