import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'militar-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="content-card">
      <div class="loading-overlay" *ngIf="isLoading()">
        <div class="spinner"></div>
        <span>Buscando dados...</span>
      </div>

      <header class="card-header">
        <div class="header-content">
          <span class="icon-circle">🪖</span>
          <div>
            <h2>{{ isEdit ? 'Editar Militar' : 'Cadastrar Novo Militar' }}</h2>
            <p>Preencha os dados do efetivo para o sistema.</p>
          </div>
        </div>
      </header>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form-body">
        <div class="grid-form">
          <div class="field">
            <label>Posto / Graduação</label>
            <input type="text" formControlName="posto" placeholder="Ex: 2T, 1S, CB..." />
          </div>
          <div class="field">
            <label>Nome Completo</label>
            <input type="text" formControlName="nomecomp" placeholder="Nome do militar" />
          </div>
          <div class="field">
            <label>SARAM</label>
            <input type="text" formControlName="saram" placeholder="Número SARAM" />
          </div>
          <div class="field">
            <label>Última Promoção</label>
            <input type="date" formControlName="ultimapromocao" />
          </div>
        </div>

        <footer class="form-actions">
          <button type="submit" class="save-btn" [disabled]="form.invalid || isLoading()">Salvar</button>
          <button type="button" class="cancel-btn" (click)="router.navigate(['/dashboard/militares'])">Cancelar</button>
        </footer>
      </form>
    </div>
  `,
  styles: [`
    .content-card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); max-width: 800px; position: relative; }
    .loading-overlay { position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(255,255,255,0.8); z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; border-radius: 12px; }
    .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #0066cc; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .card-header { padding: 1.5rem; border-bottom: 1px solid #f3f4f6; }
    .header-content { display: flex; align-items: center; gap: 1rem; }
    .icon-circle { width: 48px; height: 48px; background: #eff6ff; border-radius: 50%; display: grid; place-items: center; font-size: 1.5rem; }
    .form-body { padding: 2rem; }
    .grid-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }
    .field { display: flex; flex-direction: column; gap: 0.5rem; }
    label { font-weight: 700; font-size: 0.75rem; color: #4b5563; text-transform: uppercase; }
    input { padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; }
    .form-actions { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #f3f4f6; display: flex; gap: 1rem; }
    .save-btn { padding: 0.8rem 2rem; background: #0066cc; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
    .cancel-btn { padding: 0.8rem 2rem; background: #f3f4f6; color: #4b5563; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
  `]
})
export class MilitarFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  recordId = 0;
  isLoading = signal(false);

  constructor(private fb: FormBuilder, private api: ApiService, private route: ActivatedRoute, private notificationService: NotificationService, public router: Router) {
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
      this.isLoading.set(true);
      this.api.getMilitar(id).subscribe({
        next: (d: any) => { this.form.patchValue(d); this.isLoading.set(false); },
        error: (error) => { this.isLoading.set(false); this.notificationService.showError(error, 'Erro ao carregar'); }
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.isLoading.set(true);
    const req = this.isEdit ? this.api.updateMilitar(this.recordId, this.form.value) : this.api.createMilitar(this.form.value);
    req.subscribe({
      next: () => {
        this.notificationService.showSuccess('Sucesso', 'Militar salvo.');
        this.router.navigate(['/dashboard/militares']);
      },
      error: (error) => { this.isLoading.set(false); this.notificationService.showError(error, 'Erro ao salvar'); }
    });
  }
}