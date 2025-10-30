import { Routes } from '@angular/router';
import { Auth } from './components/log/auth/auth';
import { LibroList } from './components/libro/libro-list/libro-list';
import { Home } from './components/shared/home/home/home';
import { CarritoList } from './components/carrito/carrito-list/carrito-list';
import { BibliotecaList } from './components/biblioteca/biblioteca-list/biblioteca-list';
import { LibroFormComponent } from './components/libro/libro-form/libro-form';

export const routes: Routes = [
    {path:'auth', component:Auth},
    {path:'libro-list', component:LibroFormComponent},
    {path:'home', component:Home},
    {path:'carrito', component:CarritoList},
    {path:'biblioteca', component:BibliotecaList},
    {path:'', redirectTo:'auth', pathMatch:'full'}

];
