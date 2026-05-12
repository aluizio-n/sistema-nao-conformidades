import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface DashboardData {
  indicadores: {
    total_abertas: number;
    criticas_abertas: number;
    prazo_vencido: number;
    encerradas_mes: number;
  };
  recentes: Array<{
    id: number;
    numero: string;
    titulo: string;
    status: string;
    gravidade: string;
    tipo: string;
    abertura_em: string;
    prazo_em: string | null;
    encerramento_em: string | null;
    aberto_por_nome: string;
  }>;
  ranking_tipos: Array<{ tipo: string; total: string }>;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly API = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getDashboard() {
    return this.http.get<DashboardData>(`${this.API}/dashboard`);
  }
}
