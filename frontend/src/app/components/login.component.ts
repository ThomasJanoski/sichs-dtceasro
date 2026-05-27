import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page login-page">
      <div class="login-card">
        <header class="brand-header">
          <span class="brand">🏛️ SICHS</span>
          <span class="subtitle">DTCEA-SRO | Gestão de Hidrômetros</span>
        </header>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="field">
            <label for="username">Usuário</label>
            <input id="username" type="text" formControlName="username" placeholder="Seu usuário" />
          </div>

          <div class="field">
            <label for="password">Senha</label>
            <input id="password" type="password" formControlName="password" placeholder="••••••••" />
          </div>

          <button class="primary-btn" type="submit" [disabled]="form.invalid || isLoading()">
            {{ isLoading() ? 'Autenticando...' : 'Acessar Sistema' }}
          </button>
        </form>

        <p class="error-msg" *ngIf="error()">{{ error() }}</p>
      </div>
    </div>
  `,
  styles: [`
    .page { 
      min-height: 100vh; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      display: grid; place-items: center; padding: 1rem; font-family: 'Inter', sans-serif;
    }
    .login-card {
      background: white; padding: 2.5rem; border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1); width: 100%; max-width: 400px;
    }
    .brand-header { text-align: center; margin-bottom: 2rem; }
    .brand { display: block; font-weight: 800; font-size: 2rem; color: #0066cc; margin-bottom: 0.5rem; }
    .subtitle { color: #6b7280; font-size: 0.95rem; }
    form { display: flex; flex-direction: column; gap: 1.25rem; }
    .field { display: flex; flex-direction: column; gap: 0.5rem; }
    label { font-weight: 600; color: #374151; font-size: 0.9rem; }
    input {
      padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px;
      font-size: 1rem; transition: border-color 0.2s;
    }
    input:focus { outline: none; border-color: #0066cc; }
    .primary-btn {
      margin-top: 1rem; padding: 1rem; background: #0066cc; color: white;
      border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s;
    }
    .primary-btn:hover:not(:disabled) { background: #0052a3; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3); }
    .primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .error-msg { margin-top: 1.5rem; color: #ef4444; font-size: 0.85rem; text-align: center; font-weight: 600; }
  `]
})
export class LoginComponent {
  form: FormGroup;
  error = signal('');
  isLoading = signal(false);

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.isLoading.set(true);
    this.error.set('');
    this.auth.login(this.form.value.username, this.form.value.password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        this.isLoading.set(false);
        this.error.set(e?.error?.message ?? 'Usuário ou senha inválido');
      }
    });
  }
}