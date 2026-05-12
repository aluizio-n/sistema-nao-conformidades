import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NcService, type NaoConformidade } from '../../services/nc.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-minha-fila',
  imports: [NavbarComponent, RouterLink, DatePipe],
  templateUrl: './minha-fila.component.html',
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
