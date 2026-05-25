import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface AppToast {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly toasts = signal<AppToast[]>([]);
  private nextId = 1;

  readonly items = this.toasts.asReadonly();

  show(type: ToastType, title: string, message: string, ttl = 5000): void {
    const toast: AppToast = {
      id: this.nextId++,
      type,
      title,
      message,
    };

    this.toasts.update((current) => [...current, toast]);

    if (ttl > 0) {
      window.setTimeout(() => this.dismiss(toast.id), ttl);
    }
  }

  showSuccess(title: string, message: string): void {
    this.show('success', title, message);
  }

  showError(error: unknown, fallbackTitle = 'Não foi possível concluir a operação'): void {
    this.show('error', fallbackTitle, this.extractMessage(error));
  }

  showInfo(title: string, message: string): void {
    this.show('info', title, message);
  }

  dismiss(id: number): void {
    this.toasts.update((current) => current.filter((toast) => toast.id !== id));
  }

  private extractMessage(error: unknown): string {
    if (typeof error === 'string' && error.trim()) {
      return error;
    }

    const payload = (error as { error?: unknown; message?: string; status?: number })?.error;

    if (typeof payload === 'string' && payload.trim()) {
      return payload;
    }

    if (payload && typeof payload === 'object') {
      const maybeMessage = (payload as { message?: unknown; error?: unknown; details?: unknown }).message;
      const maybeError = (payload as { message?: unknown; error?: unknown; details?: unknown }).error;
      const maybeDetails = (payload as { message?: unknown; error?: unknown; details?: unknown }).details;

      if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
        return maybeMessage;
      }

      if (typeof maybeError === 'string' && maybeError.trim()) {
        return maybeError;
      }

      if (typeof maybeDetails === 'string' && maybeDetails.trim()) {
        return maybeDetails;
      }
    }

    if (error && typeof error === 'object') {
      const errorMessage = (error as { message?: unknown }).message;
      if (typeof errorMessage === 'string' && errorMessage.trim()) {
        return errorMessage;
      }
    }

    const status = (error as { status?: number })?.status;

    if (status === 0) {
      return 'Não foi possível alcançar o servidor. Verifique sua conexão e tente novamente.';
    }

    if (status === 401) {
      return 'Sessão inválida ou expirada. Faça login novamente.';
    }

    if (status === 404) {
      return 'O recurso solicitado não foi encontrado.';
    }

    if (status && status >= 500) {
      return 'O servidor retornou um erro inesperado. Tente novamente em instantes.';
    }

    return 'Não foi possível concluir a operação. Tente novamente.';
  }
}
