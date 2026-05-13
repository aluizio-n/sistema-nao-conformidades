import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NcService, type NaoConformidade, type AcaoCorretiva, type Usuario } from '../../services/nc.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nc-detail',
  imports: [NavbarComponent, FormsModule, DatePipe],
  templateUrl: './nc-detail.component.html',
})
export class NcDetailComponent implements OnInit {
  private ncService = inject(NcService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  auth = inject(AuthService);

  nc = signal<NaoConformidade | null>(null);
  erro = signal<string | null>(null);
  usuarios = signal<Usuario[]>([]);
  acoes = signal<AcaoCorretiva[]>([]);
  responsavelId: number | null = null;
  prazo = '';
  causaRaiz = '';

  mostrarFormAcao = false;
  novaAcao = { descricao: '', responsavel_id: 0, prazo_em: '' };
  erroAcao: string | null = null;
  acaoEvidencias: Record<number, string> = {};

  private readonly TRANSICOES: Record<string, string[]> = {
    aberta: ['em_tratamento'],
    em_tratamento: ['aguardando_verificacao', 'cancelada'],
    aguardando_verificacao: ['encerrada', 'em_tratamento'],
  };

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarNC(id);
    this.ncService.listarUsuarios().subscribe({
      next: (u) => this.usuarios.set(u),
      error: () => {},
    });
  }

  carregarNC(id: number) {
    this.ncService.buscarPorId(id).subscribe({
      next: (nc) => {
        this.nc.set(nc);
        this.responsavelId = nc.responsavel_id;
        this.prazo = nc.prazo_em ? nc.prazo_em.substring(0, 10) : '';
        this.causaRaiz = nc.causa_raiz ?? '';
        this.carregarAcoes(nc.id);
      },
      error: (e) => { console.error('Erro ao carregar NC:', e); this.erro.set('Não foi possível carregar esta NC.'); },
    });
  }

  carregarAcoes(ncId: number) {
    this.ncService.listarAcoes(ncId).subscribe({
      next: (acoes) => { this.acoes.set(acoes); this.acaoEvidencias = {}; },
      error: () => {},
    });
  }

  voltar() { this.router.navigate(['/app/ncs']); }
  transicoesPermitidas(): string[] { return this.TRANSICOES[this.nc()?.status ?? ''] ?? []; }

  atribuirResponsavel() {
    if (!this.nc() || this.responsavelId === this.nc()!.responsavel_id) return;
    this.ncService.atualizar(this.nc()!.id, { responsavel_id: this.responsavelId }).subscribe((nc) => this.nc.set(nc));
  }
  atualizarPrazo() { if (!this.nc() || !this.prazo) return; this.ncService.atualizar(this.nc()!.id, { prazo_em: this.prazo }).subscribe((nc) => this.nc.set(nc)); }
  salvarCausaRaiz() { if (!this.nc()) return; this.ncService.atualizar(this.nc()!.id, { causa_raiz: this.causaRaiz }).subscribe((nc) => this.nc.set(nc)); }

  atualizarStatus(novoStatus: string) {
    if (!this.nc()) return;
    if (novoStatus === 'encerrada' && !this.nc()!.causa_raiz) { alert('Registre a causa raiz antes de encerrar.'); return; }
    this.ncService.atualizar(this.nc()!.id, { status: novoStatus }).subscribe((nc) => this.nc.set(nc));
  }

  criarAcao() {
    if (!this.nc() || !this.novaAcao.descricao.trim() || !this.novaAcao.responsavel_id || !this.novaAcao.prazo_em) {
      this.erroAcao = 'Preencha todos os campos.';
      return;
    }
    this.erroAcao = null;
    this.ncService.criarAcao(this.nc()!.id, {
      descricao: this.novaAcao.descricao,
      responsavel_id: Number(this.novaAcao.responsavel_id),
      prazo_em: this.novaAcao.prazo_em,
    }).subscribe({
      next: () => {
        this.novaAcao = { descricao: '', responsavel_id: 0, prazo_em: '' };
        this.mostrarFormAcao = false;
        this.carregarAcoes(this.nc()!.id);
      },
      error: () => { this.erroAcao = 'Erro ao criar ação.'; },
    });
  }

  getEvidencia(acao: AcaoCorretiva): string {
    return this.acaoEvidencias[acao.id] ?? acao.evidencia ?? '';
  }

  setEvidencia(acao: AcaoCorretiva, val: string) {
    this.acaoEvidencias[acao.id] = val;
  }

  avancarStatusAcao(acao: AcaoCorretiva) {
    const proximo = acao.status === 'pendente' ? 'em_andamento' : acao.status === 'em_andamento' ? 'concluida' : null;
    if (!proximo) return;
    const evidencia = this.getEvidencia(acao);
    if (proximo === 'concluida' && !evidencia.trim()) { alert('Informe a evidência antes de concluir.'); return; }
    const payload: Record<string, unknown> = { status: proximo };
    if (proximo === 'concluida') payload['evidencia'] = evidencia;
    this.ncService.atualizarAcao(acao.id, payload).subscribe(() => this.carregarAcoes(this.nc()!.id));
  }

  labelStatusAcao(s: string): string {
    const m: Record<string, string> = { pendente: 'Pendente', em_andamento: 'Em Andamento', concluida: 'Concluída' };
    return m[s] ?? s;
  }

  badgeStatusAcao(s: string): string {
    const m: Record<string, string> = { pendente: 'text-xs px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-500', em_andamento: 'text-xs px-2 py-0.5 rounded font-medium bg-indigo-100 text-indigo-700', concluida: 'text-xs px-2 py-0.5 rounded font-medium bg-emerald-100 text-emerald-700' };
    return m[s] ?? m['pendente']!;
  }

  badgeGravidade(g: string): string {
    const m: Record<string, string> = { baixa: 'text-xs px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-500', media: 'text-xs px-2 py-0.5 rounded font-medium bg-amber-100 text-amber-700', alta: 'text-xs px-2 py-0.5 rounded font-medium bg-orange-100 text-orange-700', critica: 'text-xs px-2 py-0.5 rounded font-medium bg-red-100 text-red-700' };
    return m[g] ?? m['baixa']!;
  }
  badgeStatus(s: string): string {
    const m: Record<string, string> = { aberta: 'text-xs px-2 py-0.5 rounded font-medium bg-sky-100 text-sky-700', em_tratamento: 'text-xs px-2 py-0.5 rounded font-medium bg-indigo-100 text-indigo-700', aguardando_verificacao: 'text-xs px-2 py-0.5 rounded font-medium bg-amber-100 text-amber-700', encerrada: 'text-xs px-2 py-0.5 rounded font-medium bg-emerald-100 text-emerald-700', cancelada: 'text-xs px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-400' };
    return m[s] ?? m['aberta']!;
  }
  formatStatus(s: string): string {
    const m: Record<string, string> = { aberta: 'Aberta', em_tratamento: 'Em Tratamento', aguardando_verificacao: 'Ag. Verificação', encerrada: 'Encerrada', cancelada: 'Cancelada' };
    return m[s] ?? s;
  }
}
