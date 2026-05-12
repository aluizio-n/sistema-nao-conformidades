import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NcService, type NaoConformidade, type FiltrosNC } from '../../services/nc.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-nc-list',
  imports: [NavbarComponent, RouterLink, FormsModule, DatePipe],
  template: `
    <app-navbar />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div class="flex items-center justify-between mb-6 sm:mb-10 animate-fade-in">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Nao Conformidades</h2>
          <p class="text-sm text-slate-400 mt-1">{{ ncs().length }} registros encontrados</p>
        </div>
        <a routerLink="/app/ncs/nova"
           class="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 sm:px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 shadow-md shadow-violet-600/20 active:scale-[0.97] hover:shadow-lg hover:shadow-violet-600/25 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <span class="hidden sm:inline">Nova NC</span>
          <span class="sm:hidden">Nova</span>
        </a>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 mb-6 sm:mb-8 animate-fade-in-up" style="animation-delay: 0.1s">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          <div class="col-span-2 sm:col-span-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input type="text" [(ngModel)]="filtros.busca" (ngModelChange)="buscar()"
                   placeholder="Buscar..."
                   class="w-full pl-9 pr-3 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 outline-none transition-all duration-200 hover:border-slate-300" />
          </div>
          <select [(ngModel)]="filtros.status" (ngModelChange)="buscar()"
                  class="px-3 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] focus:ring-2 focus:ring-violet-500/20 outline-none transition-all duration-200 text-slate-600 hover:border-slate-300">
            <option value="">Status</option>
            <option value="aberta">Aberta</option>
            <option value="em_tratamento">Em Tratamento</option>
            <option value="aguardando_verificacao">Ag. Verificacao</option>
            <option value="encerrada">Encerrada</option>
            <option value="cancelada">Cancelada</option>
          </select>
          <select [(ngModel)]="filtros.gravidade" (ngModelChange)="buscar()"
                  class="px-3 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] focus:ring-2 focus:ring-violet-500/20 outline-none transition-all duration-200 text-slate-600 hover:border-slate-300">
            <option value="">Gravidade</option>
            <option value="baixa">Baixa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Critica</option>
          </select>
          <select [(ngModel)]="filtros.tipo" (ngModelChange)="buscar()"
                  class="px-3 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] focus:ring-2 focus:ring-violet-500/20 outline-none transition-all duration-200 text-slate-600 hover:border-slate-300">
            <option value="">Tipo</option>
            <option value="produto">Produto</option>
            <option value="processo">Processo</option>
            <option value="material">Material</option>
            <option value="seguranca">Seguranca</option>
            <option value="outro">Outro</option>
          </select>
          <button (click)="limparFiltros()"
                  class="px-3 py-2.5 border border-slate-200/80 rounded-xl text-[13px] text-slate-400 hover:text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            Limpar
          </button>
        </div>
      </div>

      <!-- Desktop: tabela -->
      <div class="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in-up" style="animation-delay: 0.15s">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/50">
              <th class="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Numero</th>
              <th class="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Titulo</th>
              <th class="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tipo</th>
              <th class="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gravidade</th>
              <th class="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th class="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Prazo</th>
              <th class="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Abertura</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            @for (nc of ncs(); track nc.id) {
              <tr class="hover:bg-violet-50/30 cursor-pointer transition-colors duration-150 group" [routerLink]="['/app/ncs', nc.id]">
                <td class="px-5 py-4 text-[12px] font-mono text-slate-300 bg-slate-50/30">{{ nc.numero }}</td>
                <td class="px-5 py-4 text-[13px] text-slate-700 group-hover:text-violet-700 transition-colors max-w-[280px] truncate font-medium">{{ nc.titulo }}</td>
                <td class="px-5 py-4 text-[13px] capitalize text-slate-400">{{ nc.tipo }}</td>
                <td class="px-5 py-4"><span [class]="badgeGravidade(nc.gravidade)">{{ nc.gravidade }}</span></td>
                <td class="px-5 py-4"><span [class]="badgeStatus(nc.status)">{{ formatStatus(nc.status) }}</span></td>
                <td class="px-5 py-4 text-[13px]">
                  @if (nc.prazo_em) {
                    <span [class]="prazoVencido(nc) ? 'text-rose-500 font-bold' : 'text-slate-400'">{{ nc.prazo_em | date:'dd/MM/yy' }}</span>
                    @if (prazoVencido(nc)) { <span class="ml-1 text-[9px] bg-rose-500 text-white px-1 py-0.5 rounded font-bold animate-pulse">!</span> }
                  } @else { <span class="text-slate-200">—</span> }
                </td>
                <td class="px-5 py-4 text-[13px] text-slate-300">{{ nc.abertura_em | date:'dd/MM/yy' }}</td>
              </tr>
            }
          </tbody>
        </table>
        @if (ncs().length === 0) {
          <div class="text-center py-16">
            <svg class="w-12 h-12 text-slate-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <p class="text-slate-400 text-sm font-medium">Nenhuma NC encontrada</p>
            <p class="text-slate-300 text-xs mt-1">Tente ajustar os filtros</p>
          </div>
        }
      </div>

      <!-- Mobile: cards -->
      <div class="md:hidden space-y-3">
        @for (nc of ncs(); track nc.id; let i = $index) {
          <a [routerLink]="['/app/ncs', nc.id]"
             class="block bg-white rounded-2xl border border-slate-100 shadow-sm p-4 active:bg-slate-50 transition-all duration-200 hover:shadow-md animate-fade-in-up"
             [style.animation-delay]="(i * 0.05) + 's'">
            <div class="flex items-start justify-between mb-2.5">
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="text-[10px] font-mono text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded">{{ nc.numero }}</span>
                <span [class]="badgeGravidade(nc.gravidade)">{{ nc.gravidade }}</span>
                <span [class]="badgeStatus(nc.status)">{{ formatStatus(nc.status) }}</span>
              </div>
              @if (prazoVencido(nc)) {
                <span class="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-md font-bold shrink-0 animate-pulse">VENCIDO</span>
              }
            </div>
            <p class="text-[13px] text-slate-700 font-medium mb-2.5">{{ nc.titulo }}</p>
            <div class="flex items-center gap-3 text-[11px] text-slate-400">
              <span class="capitalize bg-slate-50 px-2 py-0.5 rounded-md">{{ nc.tipo }}</span>
              <span>{{ nc.abertura_em | date:'dd/MM/yy' }}</span>
              @if (nc.prazo_em) {
                <span [class]="prazoVencido(nc) ? 'text-rose-500 font-semibold' : ''">Prazo: {{ nc.prazo_em | date:'dd/MM/yy' }}</span>
              }
            </div>
          </a>
        }
        @if (ncs().length === 0) {
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <svg class="w-10 h-10 text-slate-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <p class="text-slate-400 text-sm font-medium">Nenhuma NC encontrada</p>
            <p class="text-slate-300 text-xs mt-1">Tente ajustar os filtros</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class NcListComponent implements OnInit {
  private ncService = inject(NcService);
  ncs = signal<NaoConformidade[]>([]);
  filtros: FiltrosNC = {};

  ngOnInit() { this.buscar(); }
  buscar() { this.ncService.listar(this.filtros).subscribe((data) => this.ncs.set(data)); }
  limparFiltros() { this.filtros = {}; this.buscar(); }

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

  prazoVencido(nc: NaoConformidade): boolean {
    if (!nc.prazo_em || nc.status === 'encerrada' || nc.status === 'cancelada') return false;
    return new Date(nc.prazo_em) < new Date();
  }
}
