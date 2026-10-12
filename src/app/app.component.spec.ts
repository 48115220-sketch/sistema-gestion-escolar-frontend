import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = `http://${window.location.hostname}:8080`;

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(this.baseUrl + '/auth/login', credentials);
  }

  guardarToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }

  getAlumnos(): Observable<any> {
    return this.http.get(this.baseUrl + '/alumnos', { headers: this.getHeaders() });
  }

  crearAlumno(alumno: any): Observable<any> {
    return this.http.post(this.baseUrl + '/alumnos', alumno, { headers: this.getHeaders() });
  }

  getCursos(): Observable<any> {
    return this.http.get(this.baseUrl + '/cursos', { headers: this.getHeaders() });
  }

  getPersonal(): Observable<any> {
    return this.http.get(this.baseUrl + '/admin/personal', { headers: this.getHeaders() });
  }
}