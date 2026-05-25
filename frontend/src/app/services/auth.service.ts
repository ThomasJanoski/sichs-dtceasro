import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { tap } from 'rxjs';

interface LoginResponse {
  token: string;
  user: { usuario: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService, private router: Router) {}

  login(username: string, password: string) {
    return this.api.login(username, password).pipe(
      tap((result: LoginResponse) => {
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('auth_user', result.user.usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.router.navigate(['/']);
  }

  get token(): string | null {
    return localStorage.getItem('auth_token');
  }

  get userName(): string {
    return localStorage.getItem('auth_user') ?? '';
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }
}
