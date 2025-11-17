import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../log/auth/auth-service';

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
    const texto = event.target.value;
    console.log("Buscando:", texto);
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
