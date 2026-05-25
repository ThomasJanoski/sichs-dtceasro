import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { resolveApiBaseUrl } from '../utils/api-base-url';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = resolveApiBaseUrl();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string; user: { usuario: string } }> {
    return this.http.post<{ token: string; user: { usuario: string } }>(`${this.baseUrl}/login`, {
      username,
      password,
    });
  }

  getMilitares(): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${this.baseUrl}/militares`);
  }

  getMilitar(id: number): Observable<unknown> {
    return this.http.get(`${this.baseUrl}/militares/${id}`);
  }

  createMilitar(payload: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/militares`, payload);
  }

  updateMilitar(id: number, payload: unknown): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/militares/${id}`, payload);
  }

  deleteMilitar(id: number): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/militares/${id}`);
  }

  getHidrometroTabelas(): Observable<{ tabela: string; label: string }[]> {
    return this.http.get<{ tabela: string; label: string }[]>(`${this.baseUrl}/hidrometros/tabelas`);
  }

  getLeituras(tabela: string, datainicio?: string, datafinal?: string): Observable<unknown[]> {
    let params = new HttpParams();
    if (datainicio) params = params.set('datainicio', datainicio);
    if (datafinal) params = params.set('datafinal', datafinal);
    return this.http.get<unknown[]>(`${this.baseUrl}/hidrometros/${tabela}`, { params });
  }

  getLeitura(tabela: string, id: number): Observable<unknown> {
    return this.http.get(`${this.baseUrl}/hidrometros/${tabela}/${id}`);
  }

  getUltimaLeitura(tabela: string): Observable<{ valor: string }> {
    return this.http.get<{ valor: string }>(`${this.baseUrl}/hidrometros/${tabela}/ultima`);
  }

  createLeitura(tabela: string, payload: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/hidrometros/${tabela}`, payload);
  }

  updateLeitura(tabela: string, id: number, payload: unknown): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/hidrometros/${tabela}/${id}`, payload);
  }

  deleteLeitura(tabela: string, id: number): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/hidrometros/${tabela}/${id}`);
  }

  getRelatorioPdfUrl(tabela: string, datainicio: string, datafinal: string): string {
    const params = new HttpParams().set('datainicio', datainicio).set('datafinal', datafinal);
    return `${this.baseUrl}/hidrometros/${tabela}/pdf?${params.toString()}`;
  }
}
