import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'militar-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './militar-form.component.html',
  styleUrl: './militar-form.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MilitarFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  recordId = 0;
  isLoading = signal(false);

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
      this.isLoading.set(true);
      this.api.getMilitar(id).subscribe({
        next: (d: any) => {
          this.form.patchValue(d);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.notificationService.showError(error, 'Erro ao carregar');
        },
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.isLoading.set(true);
    const req = this.isEdit
      ? this.api.updateMilitar(this.recordId, this.form.value)
      : this.api.createMilitar(this.form.value);
    req.subscribe({
      next: () => {
        this.notificationService.showSuccess('Sucesso', 'Militar salvo.');
        this.router.navigate(['/dashboard/militares']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notificationService.showError(error, 'Erro ao salvar');
      },
    });
  }
}