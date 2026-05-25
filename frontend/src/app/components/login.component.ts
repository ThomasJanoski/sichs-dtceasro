import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="login-shell">
      <div class="login-card panel-card">
        <div class="brand-block">
          <div>
            <p class="eyebrow">SICHS</p>
            <h1>DTCEA-SRO</h1>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <label class="field-label" for="username">Usuário</label>
          <input id="username" type="text" formControlName="username" autocomplete="username" [disabled]="isLoading" />

          <label class="field-label" for="password">Senha</label>
          <input id="password" type="password" formControlName="password" autocomplete="current-password" [disabled]="isLoading" />

          <button class="primary-btn" type="submit" [disabled]="form.invalid || isLoading">
            <span *ngIf="isLoading" class="spinner"></span>
            <span>{{ isLoading ? 'Entrando...' : 'Entrar' }}</span>
          </button>
        </form>

        <p class="error" *ngIf="error">{{ error }}</p>
      </div>
    </section>
  `,
  styles: [
    `
      .login-shell {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 2rem 1rem;
      }

      .login-card {
        width: min(460px, 100%);
        padding: 2rem;
      }

      .brand-block {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .brand-mark {
        width: 3rem;
        height: 3rem;
        border-radius: 18px;
        display: grid;
        place-items: center;
        font-size: 1.4rem;
        font-weight: 900;
        background: linear-gradient(135deg, #38bdf8, #0ea5e9);
        color: #fff;
      }

      .brand-block h1 {
        margin: 0;
        font-size: 1.35rem;
      }

      .login-copy {
        color: #334155;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }

      form {
        display: grid;
        gap: 0.75rem;
      }

      button {
        margin-top: 1rem;
      }

      .error {
        margin-top: 1rem;
        color: #b42318;
        font-weight: 700;
      }

      .login-footer {
        margin-top: 1.25rem;
        display: flex;
        justify-content: space-between;
        color: #64748b;
        font-size: 0.92rem;
      }
    `,
  ],
})
export class LoginComponent {
  form: FormGroup;
  error = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.form = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.auth.login(this.form.value.username, this.form.value.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        this.isLoading = false;
        this.error = e?.error?.message ?? 'Usuário ou senha inválido';
      },
    });
  }
}
