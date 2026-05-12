import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService, type DashboardData } from '../../services/dashboard.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, RouterLink, DatePipe],
  templateUrl: './dashboard.component.html',
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
      baixa: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-500',
      media: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-amber-100 text-amber-700',
      alta: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-orange-100 text-orange-700',
      critica: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-red-100 text-red-700',
    };
    return m[g] ?? m['baixa']!;
  }

  badgeStatus(s: string): string {
    const m: Record<string, string> = {
      aberta: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-sky-100 text-sky-700',
      em_tratamento: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-indigo-100 text-indigo-700',
      aguardando_verificacao: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-amber-100 text-amber-700',
      encerrada: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-emerald-100 text-emerald-700',
      cancelada: 'text-[11px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-400',
    };
    return m[s] ?? m['aberta']!;
  }

  formatStatus(s: string): string {
    const m: Record<string, string> = { aberta: 'Aberta', em_tratamento: 'Em Tratamento', aguardando_verificacao: 'Ag. Verificação', encerrada: 'Encerrada', cancelada: 'Cancelada' };
    return m[s] ?? s;
  }

  prazoVencido(nc: { prazo_em: string | null; encerramento_em: string | null; status: string }): boolean {
    if (!nc.prazo_em || nc.status === 'encerrada' || nc.status === 'cancelada') return false;
    return new Date(nc.prazo_em) < new Date();
  }
}
