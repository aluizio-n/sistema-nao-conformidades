import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-6 lg:gap-10">
            <a routerLink="/app/dashboard" class="flex items-center gap-2.5 shrink-0 group">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all group-hover:scale-105">
                <span class="text-white text-sm font-bold">Q</span>
              </div>
              <span class="text-sm font-semibold text-white tracking-tight hidden sm:block">QualidadePIM</span>
            </a>
            <div class="hidden md:flex gap-1 bg-white/[0.04] rounded-xl p-1">
              <a routerLink="/app/dashboard" routerLinkActive="!bg-white/[0.12] !text-white shadow-sm"
                 [routerLinkActiveOptions]="{exact: true}"
                 class="px-3.5 py-2 rounded-lg text-[13px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all duration-200">
                Dashboard
              </a>
              <a routerLink="/app/ncs" routerLinkActive="!bg-white/[0.12] !text-white shadow-sm"
                 [routerLinkActiveOptions]="{exact: true}"
                 class="px-3.5 py-2 rounded-lg text-[13px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all duration-200">
                NCs
              </a>
              <a routerLink="/app/ncs/nova" routerLinkActive="!bg-white/[0.12] !text-white shadow-sm"
                 class="px-3.5 py-2 rounded-lg text-[13px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all duration-200">
                Abrir NC
              </a>
              <a routerLink="/app/minha-fila" routerLinkActive="!bg-white/[0.12] !text-white shadow-sm"
                 class="px-3.5 py-2 rounded-lg text-[13px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all duration-200">
                Minha Fila
              </a>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2.5 bg-white/[0.04] rounded-xl px-3 py-1.5">
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center ring-2 ring-violet-500/20">
                <span class="text-white text-[11px] font-semibold">{{ iniciais() }}</span>
              </div>
              <span class="text-[13px] text-slate-300 font-medium hidden sm:block">{{ auth.usuario()?.nome }}</span>
            </div>
            <button (click)="auth.logout()"
                    class="text-[12px] text-slate-500 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] transition-all duration-200">
              Sair
            </button>
            <button (click)="menuAberto.set(!menuAberto())"
                    class="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-all duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (menuAberto()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      @if (menuAberto()) {
        <div class="md:hidden border-t border-white/[0.06] px-4 pb-4 pt-3 space-y-1 bg-slate-900/95 backdrop-blur-xl animate-fade-in">
          <a routerLink="/app/dashboard" routerLinkActive="!bg-white/[0.12] !text-white"
             [routerLinkActiveOptions]="{exact: true}" (click)="menuAberto.set(false)"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200">
            <svg class="w-4.5 h-4.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Dashboard
          </a>
          <a routerLink="/app/ncs" routerLinkActive="!bg-white/[0.12] !text-white"
             [routerLinkActiveOptions]="{exact: true}" (click)="menuAberto.set(false)"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200">
            <svg class="w-4.5 h-4.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Nao Conformidades
          </a>
          <a routerLink="/app/ncs/nova" routerLinkActive="!bg-white/[0.12] !text-white"
             (click)="menuAberto.set(false)"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200">
            <svg class="w-4.5 h-4.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/></svg>
            Abrir NC
          </a>
          <a routerLink="/app/minha-fila" routerLinkActive="!bg-white/[0.12] !text-white"
             (click)="menuAberto.set(false)"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200">
            <svg class="w-4.5 h-4.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            Minha Fila
          </a>
        </div>
      }
    </nav>
  `,
})
export class NavbarComponent {
  auth = inject(AuthService);
  menuAberto = signal(false);

  iniciais(): string {
    const nome = this.auth.usuario()?.nome ?? '';
    return nome.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
  }
}
