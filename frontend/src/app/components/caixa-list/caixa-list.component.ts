import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { entityId } from '../../utils/entity-id';

@Component({
  selector: 'leitura-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './caixa-list.component.html',
  styleUrl: './caixa-list.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CaixaListComponent implements OnInit {
  tabelas = signal<{ tabela: string; label: string }[]>([]);
  tabela = signal('hidrometros');
  leituras = signal<any[]>([]);
  isLoading = signal(true);

  constructor(
    private api: ApiService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.api.getHidrometroTabelas().subscribe({
      next: (t) => {
        this.tabelas.set(t);
        if (t.length) {
          this.tabela.set(t[0].tabela);
          this.load();
        }
      },
      error: (e) => this.notificationService.showError(e, 'Erro ao carregar tabelas'),
    });
  }

  onTabela(e: Event) {
    this.tabela.set((e.target as HTMLSelectElement).value);
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.api.getLeituras(this.tabela()).subscribe({
      next: (r) => {
        this.leituras.set(r || []);
        this.isLoading.set(false);
      },
      error: (e) => {
        this.isLoading.set(false);
        this.notificationService.showError(e, 'Erro ao carregar leituras');
      },
    });
  }

  excluir(l: any) {
    if (!confirm('Excluir?')) return;
    this.api.deleteLeitura(this.tabela(), entityId(l)).subscribe({
      next: () => {
        this.notificationService.showSuccess('OK', 'Removido.');
        this.load();
      },
      error: (e) => this.notificationService.showError(e, 'Erro'),
    });
  }
}