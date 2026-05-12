import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  auth = inject(AuthService);
  menuAberto = signal(false);

  iniciais(): string {
    const nome = this.auth.usuario()?.nome ?? '';
    return nome.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
  }
}
