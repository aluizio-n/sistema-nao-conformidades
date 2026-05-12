import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NcService } from '../../services/nc.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-nc-form',
  imports: [NavbarComponent, FormsModule],
  template: `
    <app-navbar />
    <div class="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div class="mb-6 sm:mb-10 animate-fade-in">
        <button (click)="cancelar()" class="text-[13px] text-slate-400 hover:text-slate-600 font-medium mb-3 flex items-center gap-1.5 transition-colors group">
          <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          Voltar
        </button>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Abrir Nova NC</h2>
        <p class="text-sm text-slate-400 mt-1">Registre o desvio encontrado</p>
      </div>

      @if (erro()) {
        <div class="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl mb-5 text-[13px] flex items-center gap-2.5 animate-fade-in">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ erro() }}
        </div>
      }

      <form (ngSubmit)="salvar()" class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-8 space-y-5 sm:space-y-6 animate-fade-in-up" style="animation-delay: 0.1s">
        <div>
          <label class="block text-[13px] font-semibold text-slate-600 mb-2">Titulo <span class="text-rose-400">*</span></label>
          <input type="text" [(ngModel)]="nc.titulo" name="titulo" required
                 class="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 outline-none transition-all duration-200 hover:border-slate-300"
                 placeholder="Resumo curto da nao conformidade" />
        </div>

        <div>
          <label class="block text-[13px] font-semibold text-slate-600 mb-2">Descricao <span class="text-rose-400">*</span></label>
          <textarea [(ngModel)]="nc.descricao" name="descricao" required rows="4"
                    class="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 outline-none transition-all duration-200 resize-none hover:border-slate-300"
                    placeholder="Descricao detalhada do desvio observado"></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label class="block text-[13px] font-semibold text-slate-600 mb-2">Tipo <span class="text-rose-400">*</span></label>
            <select [(ngModel)]="nc.tipo" name="tipo" required
                    class="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] focus:ring-2 focus:ring-violet-500/20 outline-none transition-all duration-200 text-slate-600 hover:border-slate-300">
              <option value="produto">Produto</option>
              <option value="processo">Processo</option>
              <option value="material">Material</option>
              <option value="seguranca">Seguranca</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-slate-600 mb-2">Gravidade <span class="text-rose-400">*</span></label>
            <select [(ngModel)]="nc.gravidade" name="gravidade" required
                    class="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] focus:ring-2 focus:ring-violet-500/20 outline-none transition-all duration-200 text-slate-600 hover:border-slate-300">
              <option value="baixa">Baixa</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Critica</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label class="block text-[13px] font-semibold text-slate-600 mb-2">Linha / Processo <span class="text-rose-400">*</span></label>
            <input type="text" [(ngModel)]="nc.linha_processo" name="linha_processo" required
                   class="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] focus:ring-2 focus:ring-violet-500/20 outline-none transition-all duration-200 hover:border-slate-300"
                   placeholder="Ex: Linha A3" />
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-slate-600 mb-2">Setor <span class="text-rose-400">*</span></label>
            <input type="text" [(ngModel)]="nc.setor" name="setor" required
                   class="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-[13px] focus:ring-2 focus:ring-violet-500/20 outline-none transition-all duration-200 hover:border-slate-300"
                   placeholder="Ex: Montagem" />
          </div>
        </div>

        <div class="flex flex-col-reverse sm:flex-row gap-3 pt-5 border-t border-slate-100">
          <button type="button" (click)="cancelar()"
                  class="border border-slate-200 text-slate-500 px-6 py-3 rounded-xl text-[13px] font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 w-full sm:w-auto active:scale-[0.97]">
            Cancelar
          </button>
          <button type="submit" [disabled]="salvando()"
                  class="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 disabled:opacity-50 shadow-md shadow-violet-600/20 w-full sm:w-auto active:scale-[0.97] hover:shadow-lg hover:shadow-violet-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed">
            @if (salvando()) {
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Salvando...
            } @else {
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Abrir NC
            }
          </button>
        </div>
      </form>
    </div>
  `,
})
export class NcFormComponent {
  private ncService = inject(NcService);
  private router = inject(Router);
  nc = { titulo: '', descricao: '', tipo: 'produto', gravidade: 'baixa', linha_processo: '', setor: '' };
  erro = signal('');
  salvando = signal(false);

  salvar() {
    if (!this.nc.titulo || !this.nc.descricao || !this.nc.linha_processo || !this.nc.setor) { this.erro.set('Preencha todos os campos obrigatorios'); return; }
    this.salvando.set(true); this.erro.set('');
    this.ncService.criar(this.nc).subscribe({
      next: (nc) => this.router.navigate(['/app/ncs', nc.id]),
      error: (err) => { this.erro.set(err.error?.message ?? 'Erro ao abrir NC'); this.salvando.set(false); },
    });
  }
  cancelar() { this.router.navigate(['/app/ncs']); }
}
