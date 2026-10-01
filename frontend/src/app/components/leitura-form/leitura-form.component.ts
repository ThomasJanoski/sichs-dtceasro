import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'leitura-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leitura-form.component.html',
  styleUrl: './leitura-form.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LeituraFormComponent implements OnInit {
  form: FormGroup;
  tabelas = signal<{ tabela: string; label: string }[]>([]);
  militares = signal<any[]>([]);
  corTotal = signal('padrao');
  isReady = signal(false);
  isSaving = signal(false);
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
      total: [''],
      datacoleta: ['', Validators.required],
      horacoleta: ['', Validators.required],
      observacoes: [''],
    });
  }

  ngOnInit() {
    // Use forkJoin para esperar TUDO carregar antes de liberar o form

    forkJoin({
      tabelas: this.api.getHidrometroTabelas(),
      militares: this.api.getMilitares()
    }).subscribe({
      next: (res) => {
        this.tabelas.set(res.tabelas);
        this.militares.set(res.militares || []);
        this.isReady.set(true); // Libera o formulário
        this.carregarUltima();
      },
      error: (e) => this.notificationService.showError(e, 'Erro ao carregar dados iniciais')
    });
  }

  labelMilitar(m: any) {
    return `${m.posto ?? ''} ${m.nomecomp ?? ''}`.trim();
  }

  carregarUltima() {
    this.api.getUltimaLeitura(this.form.value.tabela).subscribe({
      next: (r) => {
        this.ultima = parseFloat(String(r.valor).replace(',', '.')) || 0;
        this.calcular();
        console.log(this.ultima);
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

    console.log(atual, total);

    this.form.patchValue({
      total: total.toFixed(3),
    });

    // Lógica da cor
    if (total >= 32) {
      this.corTotal.set('vermelho');
    } else if (total >= 25) {
      this.corTotal.set('amarelo');
    } else {
      this.corTotal.set('padrao');
    }
  }

  submit() {
    if (this.form.invalid) return;

    this.isSaving.set(true); // Inicia loading de salvamento
    const { tabela, total, ...payload } = this.form.value;

    this.api.createLeitura(tabela, payload)
      .pipe(finalize(() => this.isSaving.set(false))) // Sai do loading mesmo se der erro
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Sucesso', 'Leitura registrada.');
          this.router.navigate(['/dashboard/leituras']);
        },
        error: (e) => this.notificationService.showError(e, 'Erro ao salvar'),
      });
  }
}