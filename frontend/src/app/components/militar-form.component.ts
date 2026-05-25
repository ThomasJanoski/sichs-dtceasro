import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'militar-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="panel-card" style="padding:1.4rem; max-width: 760px;">
      <div class="section-head">
        <div>
          <p class="eyebrow">CADASTRO</p>
          <h2>{{ isEdit ? 'Editar militar' : 'Novo militar' }}</h2>
          <p class="section-copy">Atualize informações do militar com campos claros e objetivos.</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:1rem;">
          <div>
            <label class="field-label">Posto</label>
            <input class="select-input" formControlName="posto" />
          </div>

          <div>
            <label class="field-label">Nome completo</label>
            <input class="select-input" formControlName="nomecomp" />
          </div>

          <div>
            <label class="field-label">SARAM</label>
            <input class="select-input" formControlName="saram" />
          </div>

          <div>
            <label class="field-label">Última promoção</label>
            <input class="select-input" formControlName="ultimapromocao" />
          </div>
        </div>

        <div style="display:flex; gap:0.75rem; margin-top:1.4rem; flex-wrap:wrap;">
          <button class="primary-btn" type="submit" [disabled]="form.invalid">Salvar</button>
          <button class="secondary-btn" type="button" (click)="router.navigate(['/dashboard/militares'])">Cancelar</button>
        </div>
      </form>
    </section>
  `,
})
export class MilitarFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  recordId = 0;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    public router: Router,
  ) {
    this.form = fb.group({
      posto: ['', Validators.required],
      nomecomp: ['', Validators.required],
      saram: ['', Validators.required],
      ultimapromocao: [''],
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.isEdit = true;
      this.recordId = id;
      this.api.getMilitar(id).subscribe({
        next: (d: any) => this.form.patchValue(d),
        error: (error) => {
          this.notificationService.showError(error, 'Não foi possível carregar o militar');
        },
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const req = this.isEdit
      ? this.api.updateMilitar(this.recordId, this.form.value)
      : this.api.createMilitar(this.form.value);

    req.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.isEdit ? 'Militar atualizado' : 'Militar criado',
          this.isEdit
            ? 'O militar foi atualizado com sucesso.'
            : 'O militar foi criado com sucesso.',
        );
        this.router.navigate(['/dashboard/militares']);
      },
      error: (error) => {
        this.notificationService.showError(
          error,
          this.isEdit ? 'Não foi possível atualizar o militar' : 'Não foi possível criar o militar',
        );
      },
    });
  }
}
