import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {
  apiUrlAlumnos = 'http://172.100.0.150:8080/alumnos';
  apiUrlCursos = 'http://172.100.0.150:8080/cursos';

  alumnos: any[] = [];
  cursos: any[] = [];

  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  cursoId: number | null = null;

  modoEdicion: boolean = false;
  idSeleccionado: number | null = null;

  constructor(public apiService: ApiService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarAlumnos();
    this.cargarCursos();
  }

  getHeaders() {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }

  cargarAlumnos() {
    this.http.get(this.apiUrlAlumnos, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => this.alumnos = data,
      error: (err) => console.error(err)
    });
  }

  cargarCursos() {
    this.http.get(this.apiUrlCursos, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => this.cursos = data,
      error: (err) => console.error(err)
    });
  }

  guardarAlumno() {
    const alumnoDTO = {
      nombre: this.nombre,
      apellido: this.apellido,
      dni: this.dni,
      cursoId: this.cursoId
    };

    if (this.modoEdicion && this.idSeleccionado !== null) {
      this.http.put(this.apiUrlAlumnos + '/' + this.idSeleccionado, alumnoDTO, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarAlumnos();
          this.limpiarFormulario();
        }
      });
    } else {
      this.http.post(this.apiUrlAlumnos, alumnoDTO, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarAlumnos();
          this.limpiarFormulario();
        }
      });
    }
  }

  editarAlumno(alumno: any) {
    this.modoEdicion = true;
    this.idSeleccionado = alumno.id;
    this.nombre = alumno.nombre;
    this.apellido = alumno.apellido;
    this.dni = alumno.dni;
    this.cursoId = alumno.cursoId;
  }

  seleccionarParaEditar(alumno: any) {
    this.editarAlumno(alumno);
  }

  eliminarAlumno(id: number) {
    this.http.delete(this.apiUrlAlumnos + '/' + id, { headers: this.getHeaders() }).subscribe({
      next: () => this.cargarAlumnos()
    });
  }

  limpiarFormulario() {
    this.modoEdicion = false;
    this.idSeleccionado = null;
    this.nombre = '';
    this.apellido = '';
    this.dni = '';
    this.cursoId = null;
  }
}