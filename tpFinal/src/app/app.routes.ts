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

  // Redirección default
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
