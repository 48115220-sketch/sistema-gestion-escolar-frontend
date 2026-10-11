import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private apiService: ApiService, private router: Router) {}

  login(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, ingrese usuario y contraseña.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.apiService.login({ username: this.username, password: this.password }).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response && response.token) {
          this.apiService.guardarToken(response.token);
          this.router.navigate(['/alumnos']);
        } else {
          this.errorMessage = 'Respuesta del servidor no válida.';
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = 'Credenciales incorrectas o servidor no disponible.';
      }
    });
  }

  loginComo(user: string, pass: string): void {
    this.username = user;
    this.password = pass;
    this.login();
  }
}
