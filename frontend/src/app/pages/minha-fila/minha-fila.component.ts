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
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div class="mb-6 sm:mb-8">
        <h2 class="text-lg sm:text-xl font-bold text-slate-800">Minha Fila</h2>
        <p class="text-sm text-slate-400 mt-0.5">{{ ncs().length }} NCs atribuídas a você</p>
      </div>

      @if (ncs().length === 0) {
        <div class="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <svg class="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
          <p class="text-slate-500 text-sm font-medium">Nenhuma NC atribuída a você</p>
          <p class="text-slate-400 text-xs mt-1">Suas NCs aparecerão aqui quando atribuídas</p>
        </div>
      } @else {
        <div class="space-y-2.5">
          @for (nc of ncs(); track nc.id) {
            <a [routerLink]="['/app/ncs', nc.id]"
               class="block bg-white rounded-lg p-4 sm:p-5 transition-colors hover:bg-slate-50"
               [class]="prazoVencido(nc) ? 'border-l-4 border-l-red-500 border border-slate-200' : 'border border-slate-200'">
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span class="text-xs font-mono text-slate-400">{{ nc.numero }}</span>
                    <span [class]="badgeGravidade(nc.gravidade)">{{ nc.gravidade }}</span>
                    <span [class]="badgeStatus(nc.status)">{{ formatStatus(nc.status) }}</span>
                    @if (prazoVencido(nc)) {
                      <span class="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">VENCIDO</span>
                    }
                  </div>
                  <h3 class="text-sm font-medium text-slate-700 truncate">{{ nc.titulo }}</h3>
                </div>
                @if (nc.prazo_em) {
                  <div class="sm:text-right sm:ml-4 shrink-0">
                    <p class="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Prazo</p>
                    <p class="text-sm font-semibold mt-0.5" [class]="prazoVencido(nc) ? 'text-red-600' : 'text-slate-600'">
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
    const m: Record<string, string> = { baixa: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-500', media: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-amber-100 text-amber-700', alta: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-orange-100 text-orange-700', critica: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-red-100 text-red-700' };
    return m[g] ?? m['baixa']!;
  }
  badgeStatus(s: string): string {
    const m: Record<string, string> = { aberta: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-sky-100 text-sky-700', em_tratamento: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-indigo-100 text-indigo-700', aguardando_verificacao: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-amber-100 text-amber-700', encerrada: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-emerald-100 text-emerald-700', cancelada: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-400' };
    return m[s] ?? m['aberta']!;
  }
  formatStatus(s: string): string {
    const m: Record<string, string> = { aberta: 'Aberta', em_tratamento: 'Em Tratamento', aguardando_verificacao: 'Ag. Verificação', encerrada: 'Encerrada', cancelada: 'Cancelada' };
    return m[s] ?? s;
  }
}
