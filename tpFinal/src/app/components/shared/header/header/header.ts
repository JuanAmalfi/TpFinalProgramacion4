import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../log/auth/auth-service';
import { LibroStore } from '../../../libro/libro-store';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
 private auth = inject(AuthService);
  private router = inject(Router);

  menuOpen = false;
  dropdownOpen = false;


appsOpen = false;

private store=inject(LibroStore);

searchTerm = signal('');
suggestions = signal<any[]>([]);



toggleApps() {
  this.appsOpen = !this.appsOpen;
}

  // ===== GETTERS =====
  isLoggedIn() {
    return this.auth.isAuthenticated();
  }

  isAdmin() {
    return this.auth.getCurrentUser()?.isAdmin === true;
  }

  isUser() {
    const user = this.auth.getCurrentUser();
    return !!user && !user.isAdmin;
  }

  getUser() {
    return this.auth.getCurrentUser();
  }

  // ===== ACTIONS =====
  logout() {
    this.closeAll();
    this.auth.logout();
  }





 buscar(event: any) {
    const texto = event.target.value.toLowerCase();
    this.searchTerm.set(texto);

    const libros = this.store.libros();

    if (!texto) {
      this.suggestions.set([]);
      return;
    }

    const sugeridos = libros
      .filter(l =>
        l.titulo.toLowerCase().includes(texto) ||
        l.autor.toLowerCase().includes(texto)
      )
      .slice(0, 5);

    this.suggestions.set(sugeridos);
  }

  seleccionarResultado(libro: any) {
    this.suggestions.set([]);
    this.router.navigate(['/libros', libro.id]);
  }

  irAResultados() {
    const texto = this.searchTerm();
    if (!texto) return;

    this.suggestions.set([]);

    // MANDAMOS EL TEXTO A LIBRO-LIST
    this.router.navigate(['/libro-list'], {
      state: { titulo: texto }
    });
  }





  goProfile() {
    const id = this.getUser()?.id;
    if (id) {
      this.closeAll();
      this.router.navigate([`/usuarios/detalle/${id}`]);
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) this.dropdownOpen = false;
  }

  // ===== CLOSE ALL UI =====
  closeAll() {
    this.menuOpen = false;
    this.dropdownOpen = false;
  }


}
