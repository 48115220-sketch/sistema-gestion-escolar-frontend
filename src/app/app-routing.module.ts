import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AlumnosComponent } from './components/alumnos/alumnos.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { PersonalComponent } from './components/personal/personal.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'alumnos', component: AlumnosComponent, canActivate: [AuthGuard], data: { roles: ['ROOT', 'ADMINISTRATIVO', 'DOCENTE', 'PRECEPTOR', 'DIRECTOR'] } },
  { path: 'cursos', component: CursosComponent, canActivate: [AuthGuard], data: { roles: ['ROOT', 'ADMINISTRATIVO', 'DOCENTE', 'PRECEPTOR', 'DIRECTOR'] } },
  { path: 'personal', component: PersonalComponent, canActivate: [AuthGuard], data: { roles: ['ROOT', 'ADMINISTRATIVO', 'DIRECTOR'] } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
