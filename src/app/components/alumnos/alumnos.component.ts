import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {
  apiUrlAlumnos = `http://${window.location.hostname}:8080/alumnos`;
  apiUrlCursos = `http://${window.location.hostname}:8080/cursos`;

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

  esAlumnoActivo(alumno: any): boolean {
    if (alumno.estado) {
      return alumno.estado.toUpperCase() === 'HABILITADO' || alumno.estado.toUpperCase() === 'ACTIVO';
    }
    if (alumno.activo !== undefined && alumno.activo !== null) {
      return Boolean(alumno.activo);
    }
    if (alumno.habilitado !== undefined && alumno.habilitado !== null) {
      return Boolean(alumno.habilitado);
    }
    return true;
  }

  deshabilitarAlumno(id: number) {
    this.http.delete(this.apiUrlAlumnos + '/' + id, { headers: this.getHeaders() }).subscribe({
      next: () => this.cargarAlumnos(),
      error: (err) => console.error('Error al deshabilitar:', err)
    });
  }

  habilitarAlumno(alumno: any) {
    const alumnoDTO = {
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      dni: alumno.dni,
      cursoId: alumno.cursoId,
      estado: 'HABILITADO',
      activo: true
    };
    this.http.put(this.apiUrlAlumnos + '/' + alumno.id, alumnoDTO, { headers: this.getHeaders() }).subscribe({
      next: () => this.cargarAlumnos(),
      error: (err) => console.error('Error al habilitar:', err)
    });
  }

  eliminarAlumno(id: number) {
    this.deshabilitarAlumno(id);
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