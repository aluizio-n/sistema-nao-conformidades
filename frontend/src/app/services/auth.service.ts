import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    perfil: string;
  };
}

interface UserPayload {
  id: number;
  nome: string;
  perfil: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:3000/api';
  private _usuario = signal<UserPayload | null>(this.carregarUsuario());

  usuario = this._usuario.asReadonly();
  logado = computed(() => !!this._usuario());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, senha: string) {
    return this.http.post<LoginResponse>(`${this.API}/auth/login`, { email, senha }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this._usuario.set(res.usuario);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this._usuario.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private carregarUsuario(): UserPayload | null {
    const data = localStorage.getItem('usuario');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
}
