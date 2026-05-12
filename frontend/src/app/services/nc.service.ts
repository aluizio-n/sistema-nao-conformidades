import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface NaoConformidade {
  id: number;
  numero: string;
  titulo: string;
  descricao: string;
  tipo: string;
  gravidade: string;
  status: string;
  linha_processo: string;
  setor: string;
  aberto_por: number;
  abertoPor?: { id: number; nome: string };
  responsavel_id: number | null;
  responsavel?: { id: number; nome: string } | null;
  abertura_em: string;
  prazo_em: string | null;
  encerramento_em: string | null;
  causa_raiz: string | null;
  acoes?: AcaoCorretiva[];
}

export interface AcaoCorretiva {
  id: number;
  nc_id: number;
  descricao: string;
  responsavel_id: number;
  responsavel?: { id: number; nome: string };
  prazo_em: string;
  status: string;
  conclusao_em: string | null;
  evidencia: string | null;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

export interface FiltrosNC {
  status?: string;
  gravidade?: string;
  tipo?: string;
  busca?: string;
}

@Injectable({ providedIn: 'root' })
export class NcService {
  private readonly API = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  listar(filtros: FiltrosNC = {}) {
    let params = new HttpParams();
    if (filtros.status) params = params.set('status', filtros.status);
    if (filtros.gravidade) params = params.set('gravidade', filtros.gravidade);
    if (filtros.tipo) params = params.set('tipo', filtros.tipo);
    if (filtros.busca) params = params.set('busca', filtros.busca);
    return this.http.get<NaoConformidade[]>(`${this.API}/ncs`, { params });
  }

  buscarPorId(id: number) {
    return this.http.get<NaoConformidade>(`${this.API}/ncs/${id}`);
  }

  criar(nc: { titulo: string; descricao: string; tipo: string; gravidade: string; linha_processo: string; setor: string }) {
    return this.http.post<NaoConformidade>(`${this.API}/ncs`, nc);
  }

  atualizar(id: number, dados: Record<string, unknown>) {
    return this.http.patch<NaoConformidade>(`${this.API}/ncs/${id}`, dados);
  }

  minhaFila() {
    return this.http.get<NaoConformidade[]>(`${this.API}/minha-fila`);
  }

  listarUsuarios() {
    return this.http.get<Usuario[]>(`${this.API}/usuarios`);
  }

  listarAcoes(ncId: number) {
    return this.http.get<AcaoCorretiva[]>(`${this.API}/ncs/${ncId}/acoes`);
  }

  criarAcao(ncId: number, acao: { descricao: string; responsavel_id: number; prazo_em: string }) {
    return this.http.post<AcaoCorretiva>(`${this.API}/ncs/${ncId}/acoes`, acao);
  }

  atualizarAcao(acaoId: number, dados: Record<string, unknown>) {
    return this.http.patch<AcaoCorretiva>(`${this.API}/acoes/${acaoId}`, dados);
  }
}
