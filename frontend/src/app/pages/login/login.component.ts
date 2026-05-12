import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="min-h-dvh bg-slate-100 flex items-center justify-center p-4 relative">
      <div class="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-slate-100 to-indigo-50/80"></div>

      <div class="relative animate-scale-in w-full max-w-[400px]">
        <div class="bg-white rounded-2xl p-7 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-200/60">
          <div class="text-center mb-8 sm:mb-10">
            <div class="w-13 h-13 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/15">
              <span class="text-white text-lg font-bold">Q</span>
            </div>
            <h1 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">QualidadePIM</h1>
            <p class="text-slate-400 text-sm mt-1.5">Registro de Nao Conformidades</p>
          </div>

          @if (erro()) {
            <div class="bg-rose-50 border border-rose-200/60 text-rose-600 px-4 py-3 rounded-xl mb-5 text-[13px] flex items-center gap-2.5 animate-fade-in">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {{ erro() }}
            </div>
          }

          <form (ngSubmit)="entrar()" class="space-y-5">
            <div>
              <label class="block text-[13px] font-medium text-slate-600 mb-2">E-mail</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-slate-350" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <input type="email" [(ngModel)]="email" name="email" required autocomplete="email"
                       class="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-300 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 outline-none transition-all duration-200 hover:border-slate-300"
                       placeholder="seu@email.com" />
              </div>
            </div>
            <div>
              <label class="block text-[13px] font-medium text-slate-600 mb-2">Senha</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-slate-350" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <input type="password" [(ngModel)]="senha" name="senha" required autocomplete="current-password"
                       class="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-300 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 outline-none transition-all duration-200 hover:border-slate-300"
                       placeholder="********" />
              </div>
            </div>
            <button type="submit" [disabled]="carregando()"
                    class="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 text-sm shadow-md shadow-violet-600/15 mt-1 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed">
              @if (carregando()) {
                <span class="flex items-center justify-center gap-2">
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Entrando...
                </span>
              } @else {
                Entrar
              }
            </button>
          </form>

          <div class="mt-8 pt-6 border-t border-slate-100 text-center">
            <p class="text-[11px] text-slate-400">Sistema de Gestao da Qualidade</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  senha = '';
  erro = signal('');
  carregando = signal(false);

  entrar() {
    if (!this.email || !this.senha) { this.erro.set('Preencha e-mail e senha'); return; }
    this.carregando.set(true);
    this.erro.set('');
    this.auth.login(this.email, this.senha).subscribe({
      next: () => this.router.navigate(['/app/dashboard']),
      error: () => { this.erro.set('E-mail ou senha invalidos'); this.carregando.set(false); },
    });
  }
}
