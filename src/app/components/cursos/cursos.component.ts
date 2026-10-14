import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  apiUrlCursos = `http://${window.location.hostname}:8080/cursos`;
  apiUrlPersonal = `http://${window.location.hostname}:8080/admin/personal`;

  cursos: any[] = [];
  docentes: any[] = [];

  nombre: string = '';
  docenteId: number | null = null;
  cupo: number = 30;

  modoEdicion: boolean = false;
  idSeleccionado: number | null = null;

  constructor(public apiService: ApiService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarCursos();
    this.cargarDocentes();
  }

  getHeaders() {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }

  cargarCursos() {
    this.http.get(this.apiUrlCursos, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => this.cursos = data,
      error: (err) => console.error('Error al cargar cursos:', err)
    });
  }

  cargarDocentes() {
    this.http.get(this.apiUrlPersonal, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => this.docentes = data,
      error: (err) => console.error('Error al cargar docentes:', err)
    });
  }

  guardarCurso() {
    const cursoDTO = {
      nombre: this.nombre,
      docenteId: this.docenteId,
      cupo: this.cupo
    };

    if (this.modoEdicion && this.idSeleccionado !== null) {
      this.http.put(this.apiUrlCursos + '/' + this.idSeleccionado, cursoDTO, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarCursos();
          this.limpiarFormulario();
        },
        error: (err) => console.error('Error al actualizar curso:', err)
      });
    } else {
      this.http.post(this.apiUrlCursos, cursoDTO, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.cargarCursos();
          this.limpiarFormulario();
        },
        error: (err) => console.error('Error al crear curso:', err)
      });
    }
  }

  editarCurso(curso: any) {
    this.modoEdicion = true;
    this.idSeleccionado = curso.id;
    this.nombre = curso.nombre;
    this.docenteId = curso.docenteId;
    this.cupo = curso.cupo !== undefined && curso.cupo !== null ? curso.cupo : 30;
  }

  seleccionarParaEditar(curso: any) {
    this.editarCurso(curso);
  }

  eliminarCurso(id: number) {
    this.http.delete(this.apiUrlCursos + '/' + id, { headers: this.getHeaders() }).subscribe({
      next: () => this.cargarCursos(),
      error: (err) => console.error('Error al eliminar curso:', err)
    });
  }

  obtenerNombreDocente(docenteId: number): string {
    if (!docenteId) return 'Sin asignar';
    const doc = this.docentes.find(d => d.id === docenteId);
    return doc ? `${doc.nombre}${doc.apellido}` : `Docente #${docenteId}`;
  }

  limpiarFormulario() {
    this.modoEdicion = false;
    this.idSeleccionado = null;
    this.nombre = '';
    this.docenteId = null;
    this.cupo = 30;
  }
}