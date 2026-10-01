import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'leitura-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './caixa-form.component.html',
  styleUrl: './caixa-form.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
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
        this.notificationService.showSuccess(
          'Leitura salva',
          'A leitura foi registrada com sucesso.',
        );
        this.router.navigate(['/dashboard/leituras']);
      },
      error: (error) => {
        this.notificationService.showError(error, 'Não foi possível salvar a leitura');
      },
    });
  }
}