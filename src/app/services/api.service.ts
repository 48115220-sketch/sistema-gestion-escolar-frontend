import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = `http://${window.location.hostname}:8080`;

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  guardarToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  obtenerToken(): string | null {
    return this.getToken();
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
  }

  obtenerRol(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const rawRol = payload.rol || payload.role || (payload.roles && payload.roles[0]) || 'USUARIO';
      return rawRol.replace('ROLE_', '').toUpperCase();
    } catch {
      return 'USUARIO';
    }
  }

  tieneRol(rolesPermitidos: string[]): boolean {
    const rol = this.obtenerRol();
    if (!rol) return false;
    const rolesNormalizados = rolesPermitidos.map(r => r.replace('ROLE_', '').toUpperCase());
    return rolesNormalizados.includes(rol) || rol === 'ROOT';
  }

  getAlumnos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/alumnos`);
  }

  crearAlumno(alumno: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/alumnos`, alumno);
  }

  getCursos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cursos`);
  }

  getPersonal(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/personal`);
  }
}
