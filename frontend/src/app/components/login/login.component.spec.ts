import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            login: () => of({ token: 'test-token', user: { usuario: 'operador' } }),
          },
        },
      ],
    }).compileComponents();
  });

  it('shows and associates required-field feedback after blur', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const username = fixture.nativeElement.querySelector('#username') as HTMLInputElement;

    username.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(username.getAttribute('aria-invalid')).toBe('true');
    expect(username.getAttribute('aria-describedby')).toBe('username-error');
    expect(fixture.nativeElement.querySelector('#username-error')?.textContent).toContain(
      'Informe seu usuário.',
    );
  });
});