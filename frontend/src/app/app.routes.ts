import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { perfilGuard } from './guards/perfil.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  {
    path: 'app',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'ncs', loadComponent: () => import('./pages/nc-list/nc-list.component').then(m => m.NcListComponent) },
      { path: 'ncs/nova', canActivate: [perfilGuard(['inspetor', 'gestor'])], loadComponent: () => import('./pages/nc-form/nc-form.component').then(m => m.NcFormComponent) },
      { path: 'ncs/:id', loadComponent: () => import('./pages/nc-detail/nc-detail.component').then(m => m.NcDetailComponent) },
      { path: 'minha-fila', canActivate: [perfilGuard(['gestor', 'responsavel'])], loadComponent: () => import('./pages/minha-fila/minha-fila.component').then(m => m.MinhaFilaComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
