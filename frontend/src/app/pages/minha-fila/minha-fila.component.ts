import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NcService, type NaoConformidade } from '../../services/nc.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-minha-fila',
  imports: [NavbarComponent, RouterLink, DatePipe],
  template: `
    <app-navbar />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div class="mb-6 sm:mb-10 animate-fade-in">
        <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Minha Fila</h2>
        <p class="text-sm text-slate-400 mt-1">{{ ncs().length }} NCs atribuidas a voce</p>
      </div>

      @if (ncs().length === 0) {
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 sm:p-20 text-center animate-scale-in">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <svg class="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
          </div>
          <p class="text-slate-500 text-sm font-medium">Nenhuma NC atribuida a você</p>
          <p class="text-slate-300 text-xs mt-1.5">Suas NCs aparecerão aqui quando atribuidas</p>
        </div>
      } @else {
        <div class="space-y-3">
          @for (nc of ncs(); track nc.id; let i = $index) {
            <a [routerLink]="['/app/ncs', nc.id]"
               class="block bg-white rounded-2xl shadow-sm p-5 sm:p-6 transition-all duration-200 hover:shadow-md active:scale-[0.99] animate-fade-in-up group relative overflow-hidden"
               [class]="prazoVencido(nc) ? 'border-2 border-rose-200' : 'border border-slate-100 hover:border-slate-200'"
               [style.animation-delay]="(i * 0.05) + 's'">
              @if (prazoVencido(nc)) {
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-400 to-rose-500"></div>
              } @else {
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                     [class]="nc.gravidade === 'critica' ? 'from-rose-400 to-rose-500' : nc.gravidade === 'alta' ? 'from-orange-400 to-orange-500' : nc.gravidade === 'media' ? 'from-amber-400 to-amber-500' : 'from-slate-300 to-slate-400'"></div>
              }
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0 pl-2">
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2 mb-2">
                    <span class="text-[10px] sm:text-[11px] font-mono text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded">{{ nc.numero }}</span>
                    <span [class]="badgeGravidade(nc.gravidade)">{{ nc.gravidade }}</span>
                    <span [class]="badgeStatus(nc.status)">{{ formatStatus(nc.status) }}</span>
                    @if (prazoVencido(nc)) {
                      <span class="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-md font-bold animate-pulse">VENCIDO</span>
                    }
                  </div>
                  <h3 class="text-[13px] sm:text-sm font-semibold text-slate-700 truncate group-hover:text-violet-700 transition-colors">{{ nc.titulo }}</h3>
                </div>
                @if (nc.prazo_em) {
                  <div class="sm:text-right sm:ml-4 shrink-0 bg-slate-50 rounded-xl px-3 py-2">
                    <p class="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Prazo</p>
                    <p class="text-[13px] font-bold mt-0.5" [class]="prazoVencido(nc) ? 'text-rose-500' : 'text-slate-600'">
                      {{ nc.prazo_em | date:'dd/MM/yyyy' }}
                    </p>
                  </div>
                }
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class MinhaFilaComponent implements OnInit {
  private ncService = inject(NcService);
  ncs = signal<NaoConformidade[]>([]);

  ngOnInit() { this.ncService.minhaFila().subscribe((data) => this.ncs.set(data)); }

  prazoVencido(nc: NaoConformidade): boolean {
    if (!nc.prazo_em) return false;
    return new Date(nc.prazo_em) < new Date();
  }

  badgeGravidade(g: string): string {
    const m: Record<string, string> = { baixa: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-500', media: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-amber-50 text-amber-600', alta: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-orange-50 text-orange-600', critica: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-rose-50 text-rose-600' };
    return m[g] ?? m['baixa']!;
  }
  badgeStatus(s: string): string {
    const m: Record<string, string> = { aberta: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-sky-50 text-sky-600', em_tratamento: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-violet-50 text-violet-600', aguardando_verificacao: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-amber-50 text-amber-600', encerrada: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-600', cancelada: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold bg-slate-50 text-slate-400' };
    return m[s] ?? m['aberta']!;
  }
  formatStatus(s: string): string {
    const m: Record<string, string> = { aberta: 'Aberta', em_tratamento: 'Em Tratamento', aguardando_verificacao: 'Ag. Verificacao', encerrada: 'Encerrada', cancelada: 'Cancelada' };
    return m[s] ?? s;
  }
}
