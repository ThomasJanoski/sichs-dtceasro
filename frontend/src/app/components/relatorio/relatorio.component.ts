import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'relatorio-hidrometro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './relatorio.component.html',
  styleUrl: './relatorio.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RelatorioComponent implements OnInit {
  form: FormGroup;
  tabelas = signal<{ tabela: string; label: string }[]>([]);
  isLoading = signal(true);

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
        this.isLoading.set(false);
      },
      error: (e) => {
        this.isLoading.set(false);
        this.notificationService.showError(e, 'Erro');
      },
    });
  }

  gerar() {
    const v = this.form.value;
    window.open(this.api.getRelatorioPdfUrl(v.tabela, v.datainicio, v.datafinal), '_blank');
  }
}