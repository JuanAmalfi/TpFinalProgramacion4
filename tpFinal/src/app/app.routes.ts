import { Routes } from '@angular/router';
import { Auth } from './components/log/auth/auth';
import { LibroList } from './components/libro/libro-list/libro-list';
import { Home } from './components/shared/home/home/home';
import { CarritoList } from './components/carrito/carrito-list/carrito-list';
import { BibliotecaList } from './components/biblioteca/biblioteca-list/biblioteca-list';
import { LibroFormComponent } from './components/libro/libro-form/libro-form';
import { LibroDetails } from './components/libro/libro-details/libro-details';
import { RoleGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard';
import { Usuario } from './components/usuario/usuario';
import { UsuarioList } from './components/usuario/usuario-list/usuario-list';
import { UsuarioDetalle } from './components/usuario/usuario-detalle/usuario-detalle';
import { UsuarioEditar } from './components/usuario/usuario-editar/usuario-editar';
import { LibroEdit } from './components/libro/libro-edit/libro-edit';



export const routes: Routes = [
    { path: 'auth', component: Auth },

  // Home
  { path: 'home', component: Home },

  // Listado de libros (acceso libre)
  { path: 'libro-list', component: LibroList },

  // Ver detalles del libro (acceso libre)
  { path: 'libros/:id', component: LibroDetails },

  // Formulario CRUD de libros → SOLO ADMIN
  {
    path: 'libro-form',
    component: LibroFormComponent,
    canActivate: [RoleGuard('ADMIN')]
  },
  {
    path:'libro-edit/:id',
    component:LibroEdit,
    canActivate: [RoleGuard('ADMIN')]
  },
  {
    path:'usuario-list',
    component:UsuarioList,
    canActivate: [RoleGuard('ADMIN')]
  },
  {
  path: 'usuarios/detalle/:id',
  component: UsuarioDetalle,
  canActivate: [AuthGuard] 
  }
,
{
path: 'usuarios/editar/:id',
  component: UsuarioEditar,
  canActivate: [AuthGuard]

},

  // Carrito → requiere login
  {
    path: 'carrito',
    component: CarritoList,
    canActivate: [AuthGuard]
  },

  // Biblioteca del usuario → requiere login
  {
    path: 'biblioteca',
    component: BibliotecaList,
    canActivate: [AuthGuard]
  },
  { path: 'usuarios/nuevo', component: Usuario },


  // Redirección default
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
