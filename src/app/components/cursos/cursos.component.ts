import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  apiUrl = `http://${window.location.hostname}:8080/cursos`;

  cursos: any[] = [];
  nombre: string = '';
  docenteId: number | null = null;

  modoEdicion: boolean = false;
  idSeleccionado: number | null = null;

  constructor(public apiService: ApiService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  getHeaders() {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }

  cargarCursos() {
    this.http.get(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => this.cursos = data,
      error: (err) => console.error(err)
    });
  }

  guardarCurso() {
    const cursoDTO = {
      nombre: this.nombre,
      docenteId: this.docenteId
    };

    if (this.modoEdicion && this.idSeleccionado !== null) {
      this.http.put(this.apiUrl + '/' + this.idSeleccionado, cursoDTO, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarCursos();
          this.limpiarFormulario();
        }
      });
    } else {
      this.http.post(this.apiUrl, cursoDTO, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarCursos();
          this.limpiarFormulario();
        }
      });
    }
  }

  editarCurso(curso: any) {
    this.modoEdicion = true;
    this.idSeleccionado = curso.id;
    this.nombre = curso.nombre;
    this.docenteId = curso.docenteId;
  }

  seleccionarParaEditar(curso: any) {
    this.editarCurso(curso);
  }

  eliminarCurso(id: number) {
    this.http.delete(this.apiUrl + '/' + id, { headers: this.getHeaders() }).subscribe({
      next: () => this.cargarCursos()
    });
  }

  limpiarFormulario() {
    this.modoEdicion = false;
    this.idSeleccionado = null;
    this.nombre = '';
    this.docenteId = null;
  }
}