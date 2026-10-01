import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { entityId } from '../../utils/entity-id';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'leitura-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './leitura-list.component.html',
  styleUrl: './leitura-list.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LeituraListComponent implements OnInit {
  tabelas = signal<{ tabela: string; label: string }[]>([]);
  tabela = signal('hidrometros');
  leituras = signal<any[]>([]);
  isLoading = signal(true);

  currentPage = signal(1);
  lastPage = signal(1);

  constructor(
    private api: ApiService,
    private notificationService: NotificationService,
  ) { }

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

  load(page: number = 1) {
    this.isLoading.set(true);
    this.api.getLeituras(this.tabela(), page).subscribe({
      next: (r: any) => {
        // r.data é o array, r.current_page é o número da página
        this.leituras.set(r.data);
        this.currentPage.set(r.current_page);
        this.lastPage.set(r.last_page);
        this.isLoading.set(false); // <--- Isso aqui é o que faz o spinner sumir e a tela atualizar
      },
      error: (e) => {
        this.isLoading.set(false); // <--- Importante também em caso de erro
        this.notificationService.showError(e, 'Erro ao carregar');
      },
    });
  }

  excluir(l: any) {
    Swal.fire({
      title: 'Excluir registro?',
      text: "Você não poderá reverter esta ação!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading.set(true);
        this.api.deleteLeitura(this.tabela(), entityId(l)).subscribe({
          next: () => {
            this.notificationService.showSuccess('OK', 'Removido.');

            // Se for o último item da página atual, volta para a anterior
            if (this.leituras().length === 1 && this.currentPage() > 1) {
              this.load(this.currentPage() - 1);
            } else {
              this.load(this.currentPage()); // Recarrega a página atual
            }
          },
          error: (e) => {
            this.isLoading.set(false);
            this.notificationService.showError(e, 'Erro ao excluir');
          }
        });
      }
    });
  }
}