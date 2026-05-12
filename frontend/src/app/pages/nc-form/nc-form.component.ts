import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NcService } from '../../services/nc.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-nc-form',
  imports: [NavbarComponent, FormsModule],
  templateUrl: './nc-form.component.html',
})
export class NcFormComponent {
  private ncService = inject(NcService);
  private router = inject(Router);
  nc = { titulo: '', descricao: '', tipo: 'produto', gravidade: 'baixa', linha_processo: '', setor: '' };
  erro = signal('');
  salvando = signal(false);

  salvar() {
    if (!this.nc.titulo || !this.nc.descricao || !this.nc.linha_processo || !this.nc.setor) { this.erro.set('Preencha todos os campos obrigatórios'); return; }
    this.salvando.set(true); this.erro.set('');
    this.ncService.criar(this.nc).subscribe({
      next: (nc) => this.router.navigate(['/app/ncs', nc.id]),
      error: (err) => { this.erro.set(err.error?.message ?? 'Erro ao abrir NC'); this.salvando.set(false); },
    });
  }
  cancelar() { this.router.navigate(['/app/ncs']); }
}
