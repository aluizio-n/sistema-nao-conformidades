import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function perfilGuard(perfis: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const usuario = auth.usuario();
    if (usuario && perfis.includes(usuario.perfil)) return true;
    router.navigate(['/app/dashboard']);
    return false;
  };
}
