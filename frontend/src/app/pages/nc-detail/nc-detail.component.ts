import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NcService, type NaoConformidade, type Usuario } from '../../services/nc.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-nc-detail',
  imports: [NavbarComponent, FormsModule, DatePipe],
  template: `
    <app-navbar />
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      @if (nc()) {
        <div class="animate-fade-in">
          <button (click)="voltar()" class="text-[13px] text-slate-400 hover:text-slate-600 font-medium mb-4 flex items-center gap-1.5 transition-colors group">
            <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            Voltar
          </button>
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6 sm:mb-10">
            <div class="min-w-0">
              <p class="text-[12px] font-mono text-slate-300 mb-1.5 bg-slate-100 inline-block px-2 py-0.5 rounded-md">{{ nc()!.numero }}</p>
              <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">{{ nc()!.titulo }}</h2>
            </div>
            <div class="flex gap-2 shrink-0">
              <span [class]="badgeGravidade(nc()!.gravidade)">{{ nc()!.gravidade }}</span>
              <span [class]="badgeStatus(nc()!.status)">{{ formatStatus(nc()!.status) }}</span>
            </div>
          </div>
        </div>

        <!-- Mobile: gestao primeiro -->
        <div class="lg:hidden mb-5 animate-fade-in-up" style="animation-delay: 0.05s">
          <details class="bg-white rounded-2xl border border-slate-100 shadow-sm group">
            <summary class="px-5 py-4 text-sm font-bold text-slate-700 cursor-pointer select-none flex items-center justify-between">
              Gestao
              <svg class="w-4 h-4 text-slate-300 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <div class="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
              <div>
                <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Responsavel</label>
                <select [(ngModel)]="responsavelId" (ngModelChange)="atribuirResponsavel()"
                        [disabled]="nc()!.status === 'encerrada' || nc()!.status === 'cancelada'"
                        class="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 disabled:opacity-50 text-slate-600 hover:border-slate-300">
                  <option [ngValue]="null">Nao atribuido</option>
                  @for (u of usuarios(); track u.id) { <option [ngValue]="u.id">{{ u.nome }}</option> }
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Prazo</label>
                <input type="date" [(ngModel)]="prazo" (change)="atualizarPrazo()"
                       [disabled]="nc()!.status === 'encerrada' || nc()!.status === 'cancelada'"
                       class="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 disabled:opacity-50 hover:border-slate-300" />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Causa Raiz</label>
                <textarea [(ngModel)]="causaRaiz" rows="2"
                          [disabled]="nc()!.status === 'encerrada' || nc()!.status === 'cancelada'"
                          class="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 resize-none disabled:opacity-50 hover:border-slate-300"
                          placeholder="Causa raiz..."></textarea>
                <button (click)="salvarCausaRaiz()" [disabled]="nc()!.status === 'encerrada' || nc()!.status === 'cancelada'"
                        class="mt-2 text-[12px] text-violet-500 hover:text-violet-600 px-3.5 py-2 rounded-xl border border-violet-200 hover:bg-violet-50 transition-all duration-200 disabled:opacity-50 font-medium">Salvar</button>
              </div>
              @if (nc()!.status !== 'encerrada' && nc()!.status !== 'cancelada') {
                <div class="pt-4 border-t border-slate-100 space-y-2">
                  @for (s of transicoesPermitidas(); track s) {
                    <button (click)="atualizarStatus(s)"
                            class="w-full text-left px-4 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 border active:scale-[0.98]"
                            [class]="s === 'encerrada' ? 'border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100' :
                                     s === 'cancelada' ? 'border-rose-200 bg-rose-50/50 text-rose-600 hover:bg-rose-100' :
                                     'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'">
                      {{ formatStatus(s) }}
                    </button>
                  }
                </div>
              }
            </div>
          </details>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          <div class="lg:col-span-2 space-y-5 sm:space-y-6">
            <!-- Info -->
            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-7 animate-fade-in-up" style="animation-delay: 0.1s">
              <h3 class="text-sm font-bold text-slate-700 mb-4">Descricao</h3>
              <p class="text-[13px] text-slate-500 whitespace-pre-line leading-relaxed">{{ nc()!.descricao }}</p>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-slate-100">
                <div class="space-y-1">
                  <span class="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tipo</span>
                  <p class="text-[13px] font-semibold text-slate-700 capitalize">{{ nc()!.tipo }}</p>
                </div>
                <div class="space-y-1">
                  <span class="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Setor</span>
                  <p class="text-[13px] font-semibold text-slate-700">{{ nc()!.setor }}</p>
                </div>
                <div class="space-y-1">
                  <span class="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Linha</span>
                  <p class="text-[13px] font-semibold text-slate-700">{{ nc()!.linha_processo }}</p>
                </div>
                <div class="space-y-1">
                  <span class="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Aberto por</span>
                  <p class="text-[13px] font-semibold text-slate-700">{{ nc()!.abertoPor?.nome }}</p>
                </div>
                <div class="space-y-1">
                  <span class="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Abertura</span>
                  <p class="text-[13px] font-semibold text-slate-700">{{ nc()!.abertura_em | date:'dd/MM/yy HH:mm' }}</p>
                </div>
                @if (nc()!.encerramento_em) {
                  <div class="space-y-1">
                    <span class="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Encerramento</span>
                    <p class="text-[13px] font-semibold text-emerald-600">{{ nc()!.encerramento_em | date:'dd/MM/yy HH:mm' }}</p>
                  </div>
                }
              </div>

              @if (nc()!.causa_raiz) {
                <div class="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-slate-100">
                  <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Causa Raiz</span>
                  <p class="text-[13px] text-slate-600 mt-1.5 whitespace-pre-line leading-relaxed bg-slate-50/70 rounded-xl p-4 border border-slate-100">{{ nc()!.causa_raiz }}</p>
                </div>
              }
            </div>

          </div>

          <!-- Desktop sidebar -->
          <div class="hidden lg:block space-y-6 animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5 sticky top-24">
              <h3 class="text-sm font-bold text-slate-700 flex items-center gap-2">
                <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Gestao
              </h3>
              <div>
                <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Responsavel</label>
                <select [(ngModel)]="responsavelId" (ngModelChange)="atribuirResponsavel()"
                        [disabled]="nc()!.status === 'encerrada' || nc()!.status === 'cancelada'"
                        class="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 disabled:opacity-50 text-slate-600 hover:border-slate-300">
                  <option [ngValue]="null">Nao atribuido</option>
                  @for (u of usuarios(); track u.id) { <option [ngValue]="u.id">{{ u.nome }}</option> }
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Prazo</label>
                <input type="date" [(ngModel)]="prazo" (change)="atualizarPrazo()"
                       [disabled]="nc()!.status === 'encerrada' || nc()!.status === 'cancelada'"
                       class="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 disabled:opacity-50 hover:border-slate-300" />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Causa Raiz</label>
                <textarea [(ngModel)]="causaRaiz" rows="3"
                          [disabled]="nc()!.status === 'encerrada' || nc()!.status === 'cancelada'"
                          class="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 resize-none disabled:opacity-50 hover:border-slate-300"
                          placeholder="Causa raiz..."></textarea>
                <button (click)="salvarCausaRaiz()" [disabled]="nc()!.status === 'encerrada' || nc()!.status === 'cancelada'"
                        class="mt-2 text-[12px] text-violet-500 hover:text-violet-600 px-3.5 py-2 rounded-xl border border-violet-200 hover:bg-violet-50 transition-all duration-200 disabled:opacity-50 font-medium">Salvar</button>
              </div>
              @if (nc()!.status !== 'encerrada' && nc()!.status !== 'cancelada') {
                <div class="pt-5 border-t border-slate-100 space-y-2">
                  <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Status</label>
                  @for (s of transicoesPermitidas(); track s) {
                    <button (click)="atualizarStatus(s)"
                            class="w-full text-left px-4 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 border active:scale-[0.98]"
                            [class]="s === 'encerrada' ? 'border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100 hover:shadow-sm' :
                                     s === 'cancelada' ? 'border-rose-200 bg-rose-50/50 text-rose-600 hover:bg-rose-100 hover:shadow-sm' :
                                     'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100 hover:shadow-sm'">
                      {{ formatStatus(s) }}
                    </button>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-24">
          <div class="inline-block w-10 h-10 border-[3px] border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
          <p class="text-slate-400 text-sm mt-4">Carregando...</p>
        </div>
      }
    </div>
  `,
})
export class NcDetailComponent implements OnInit {
  private ncService = inject(NcService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  nc = signal<NaoConformidade | null>(null);
  usuarios = signal<Usuario[]>([]);
  responsavelId: number | null = null;
  prazo = '';
  causaRaiz = '';
  gestaoTemplate = false;

  private readonly TRANSICOES: Record<string, string[]> = {
    aberta: ['em_tratamento'],
    em_tratamento: ['aguardando_verificacao', 'cancelada'],
    aguardando_verificacao: ['encerrada', 'em_tratamento'],
  };

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarNC(id);
    this.ncService.listarUsuarios().subscribe((u) => this.usuarios.set(u));
  }

  carregarNC(id: number) {
    this.ncService.buscarPorId(id).subscribe({
      next: (nc) => { this.nc.set(nc); this.responsavelId = nc.responsavel_id; this.prazo = nc.prazo_em ? nc.prazo_em.substring(0, 10) : ''; this.causaRaiz = nc.causa_raiz ?? ''; },
      error: () => this.router.navigate(['/app/ncs']),
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

  badgeGravidade(g: string): string {
    const m: Record<string, string> = { baixa: 'text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-slate-100 text-slate-500', media: 'text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-amber-50 text-amber-600', alta: 'text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-orange-50 text-orange-600', critica: 'text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-rose-50 text-rose-600' };
    return m[g] ?? m['baixa']!;
  }
  badgeStatus(s: string): string {
    const m: Record<string, string> = { aberta: 'text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-sky-50 text-sky-600', em_tratamento: 'text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-violet-50 text-violet-600', aguardando_verificacao: 'text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-amber-50 text-amber-600', encerrada: 'text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-emerald-50 text-emerald-600', cancelada: 'text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-slate-50 text-slate-400' };
    return m[s] ?? m['aberta']!;
  }
  formatStatus(s: string): string {
    const m: Record<string, string> = { aberta: 'Aberta', em_tratamento: 'Em Tratamento', aguardando_verificacao: 'Ag. Verificacao', encerrada: 'Encerrada', cancelada: 'Cancelada' };
    return m[s] ?? s;
  }
}
