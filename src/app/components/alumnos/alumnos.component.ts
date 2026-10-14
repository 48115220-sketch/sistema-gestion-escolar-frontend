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

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (token || '')
    });
  }

  cargarAlumnos(): void {
    this.http.get(this.apiUrlAlumnos, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => this.alumnos = data,
      error: (err) => console.error('Error al cargar alumnos:', err)
    });
  }

  cargarCursos(): void {
    this.http.get(this.apiUrlCursos, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => this.cursos = data,
      error: (err) => console.error('Error al cargar cursos:', err)
    });
  }

  guardarAlumno(): void {
    const alumnoDTO = {
      nombre: this.nombre,
      apellido: this.apellido,
      dni: this.dni,
      cursoId: this.cursoId
    };

    if (this.modoEdicion && this.idSeleccionado !== null) {
      this.http.put(`${this.apiUrlAlumnos}/${this.idSeleccionado}`, alumnoDTO, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarAlumnos();
          this.limpiarFormulario();
        },
        error: (err) => console.error('Error al actualizar alumno:', err)
      });
    } else {
      this.http.post(this.apiUrlAlumnos, alumnoDTO, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarAlumnos();
          this.limpiarFormulario();
        },
        error: (err) => console.error('Error al guardar alumno:', err)
      });
    }
  }

  editarAlumno(alumno: any): void {
    this.modoEdicion = true;
    this.idSeleccionado = alumno.id;
    this.nombre = alumno.nombre;
    this.apellido = alumno.apellido;
    this.dni = alumno.dni;
    this.cursoId = alumno.cursoId;
  }

  seleccionarParaEditar(alumno: any): void {
    this.editarAlumno(alumno);
  }

  esAlumnoActivo(alumno: any): boolean {
    if (!alumno) return false;
    if (alumno.estado) {
      return alumno.estado.toUpperCase() === 'HABILITADO' || alumno.estado.toUpperCase() === 'ACTIVO';
    }
    if (alumno.activo !== undefined && alumno.activo !== null) {
      return Boolean(alumno.activo);
    }
    return true;
  }

  deshabilitarAlumno(id: number): void {
    this.http.delete(`${this.apiUrlAlumnos}/${id}`, { headers: this.getHeaders() }).subscribe({
      next: () => this.cargarAlumnos(),
      error: (err) => console.error('Error al deshabilitar:', err)
    });
  }

  habilitarAlumno(alumno: any): void {
    const alumnoDTO = {
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      dni: alumno.dni,
      cursoId: alumno.cursoId,
      estado: 'HABILITADO'
    };
    this.http.put(`${this.apiUrlAlumnos}/${alumno.id}`, alumnoDTO, { headers: this.getHeaders() }).subscribe({
      next: () => this.cargarAlumnos(),
      error: (err) => console.error('Error al habilitar:', err)
    });
  }

  obtenerNombreCurso(cursoId: any): string {
    if (!cursoId) return 'Sin Asignar';
    const c = this.cursos.find(item => item.id === cursoId || item.id === Number(cursoId));
    return c ? c.nombre : `Curso #${cursoId}`;
  }

  limpiarFormulario(): void {
    this.modoEdicion = false;
    this.idSeleccionado = null;
    this.nombre = '';
    this.apellido = '';
    this.dni = '';
    this.cursoId = null;
  }
}