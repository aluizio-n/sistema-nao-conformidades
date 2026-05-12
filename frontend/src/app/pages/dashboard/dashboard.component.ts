import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService, type DashboardData } from '../../services/dashboard.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, RouterLink, DatePipe],
  template: `
    <app-navbar />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div class="mb-6 sm:mb-10 animate-fade-in">
        <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h2>
        <p class="text-sm text-slate-400 mt-1">Visao geral da qualidade</p>
      </div>

      @if (dados()) {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-12">
          <div class="animate-fade-in-up stagger-1 group bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-transparent"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3 sm:mb-4">
                <span class="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Abertas</span>
                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
              </div>
              <p class="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">{{ dados()!.indicadores.total_abertas }}</p>
            </div>
          </div>

          <div class="animate-fade-in-up stagger-2 group bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-rose-500/5 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-rose-500/[0.03] to-transparent"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3 sm:mb-4">
                <span class="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Criticas</span>
                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                </div>
              </div>
              <p class="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">{{ dados()!.indicadores.criticas_abertas }}</p>
            </div>
          </div>

          <div class="animate-fade-in-up stagger-3 group bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] to-transparent"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3 sm:mb-4">
                <span class="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Vencidas</span>
                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
              </div>
              <p class="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">{{ dados()!.indicadores.prazo_vencido }}</p>
            </div>
          </div>

          <div class="animate-fade-in-up stagger-4 group bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3 sm:mb-4">
                <span class="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Encerradas</span>
                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
              </div>
              <p class="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">{{ dados()!.indicadores.encerradas_mes }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          <div class="lg:col-span-2 animate-fade-in-up" style="animation-delay: 0.25s">
            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div class="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100/80 flex items-center justify-between">
                <h3 class="text-sm font-bold text-slate-700">NCs Recentes</h3>
                <a routerLink="/app/ncs" class="text-[12px] text-violet-500 hover:text-violet-600 font-medium transition-colors">Ver todas</a>
              </div>
              <div class="divide-y divide-slate-50">
                @for (nc of dados()!.recentes; track nc.id) {
                  <a [routerLink]="['/app/ncs', nc.id]"
                     class="flex items-start sm:items-center justify-between px-5 sm:px-6 py-4 hover:bg-slate-50/70 transition-all duration-200 group">
                    <div class="flex-1 min-w-0">
                      <div class="flex flex-wrap items-center gap-2 mb-1">
                        <span class="text-[10px] sm:text-[11px] font-mono text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded">{{ nc.numero }}</span>
                        <span [class]="badgeGravidade(nc.gravidade)">{{ nc.gravidade }}</span>
                        <span [class]="badgeStatus(nc.status)" class="hidden sm:inline">{{ formatStatus(nc.status) }}</span>
                        @if (prazoVencido(nc)) {
                          <span class="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-md font-semibold animate-pulse">VENCIDA</span>
                        }
                      </div>
                      <p class="text-[13px] text-slate-700 truncate group-hover:text-slate-900 transition-colors font-medium">{{ nc.titulo }}</p>
                    </div>
                    <div class="flex items-center gap-2 ml-4 shrink-0">
                      <span class="text-[11px] text-slate-300 mt-0.5 sm:mt-0">{{ nc.abertura_em | date:'dd/MM' }}</span>
                      <svg class="w-4 h-4 text-slate-200 group-hover:text-violet-400 transition-colors hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </div>
                  </a>
                }
                @empty {
                  <div class="px-6 py-16 text-center">
                    <svg class="w-10 h-10 text-slate-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <p class="text-slate-300 text-sm">Nenhuma NC registrada</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="animate-fade-in-up" style="animation-delay: 0.3s">
            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div class="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100/80">
                <h3 class="text-sm font-bold text-slate-700">Top Desvios do Mes</h3>
              </div>
              <div class="p-5 sm:p-6 space-y-3">
                @for (item of dados()!.ranking_tipos; track item.tipo; let i = $index) {
                  <div class="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 transition-colors group">
                    <span class="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                          [class]="i === 0 ? 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/20' : i === 1 ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20' : 'bg-gradient-to-br from-slate-400 to-slate-500 shadow-slate-400/20'">
                      {{ i + 1 }}
                    </span>
                    <div class="flex-1 min-w-0">
                      <span class="text-[13px] font-medium text-slate-600 capitalize block truncate">{{ item.tipo }}</span>
                      <div class="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-500"
                             [class]="i === 0 ? 'bg-gradient-to-r from-rose-400 to-pink-500' : i === 1 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-slate-300 to-slate-400'"
                             [style.width.%]="getBarWidth(item.total)">
                        </div>
                      </div>
                    </div>
                    <span class="text-lg sm:text-xl font-extrabold text-slate-800 tabular-nums">{{ item.total }}</span>
                  </div>
                }
                @empty {
                  <div class="text-center py-8">
                    <svg class="w-8 h-8 text-slate-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                    <p class="text-slate-300 text-sm">Sem dados no mes</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-24">
          <div class="inline-block w-10 h-10 border-[3px] border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
          <p class="text-slate-400 text-sm mt-4">Carregando dados...</p>
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  dados = signal<DashboardData | null>(null);

  ngOnInit() { this.dashboardService.getDashboard().subscribe((data) => this.dados.set(data)); }

  getBarWidth(total: string): number {
    const d = this.dados();
    if (!d || !d.ranking_tipos.length) return 0;
    return (Number(total) / Number(d.ranking_tipos[0].total)) * 100;
  }

  badgeGravidade(g: string): string {
    const m: Record<string, string> = {
      baixa: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-500',
      media: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-amber-50 text-amber-600',
      alta: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-orange-50 text-orange-600',
      critica: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-rose-50 text-rose-600',
    };
    return m[g] ?? m['baixa']!;
  }

  badgeStatus(s: string): string {
    const m: Record<string, string> = {
      aberta: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-sky-50 text-sky-600',
      em_tratamento: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-violet-50 text-violet-600',
      aguardando_verificacao: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-amber-50 text-amber-600',
      encerrada: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-600',
      cancelada: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-slate-50 text-slate-400',
    };
    return m[s] ?? m['aberta']!;
  }

  formatStatus(s: string): string {
    const m: Record<string, string> = { aberta: 'Aberta', em_tratamento: 'Em Tratamento', aguardando_verificacao: 'Ag. Verificacao', encerrada: 'Encerrada', cancelada: 'Cancelada' };
    return m[s] ?? s;
  }

  prazoVencido(nc: { prazo_em: string | null; encerramento_em: string | null; status: string }): boolean {
    if (!nc.prazo_em || nc.status === 'encerrada' || nc.status === 'cancelada') return false;
    return new Date(nc.prazo_em) < new Date();
  }
}
