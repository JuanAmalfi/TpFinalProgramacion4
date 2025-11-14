import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../../log/auth/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
private auth = inject(AuthService);

  isLoggedIn() {
    return this.auth.isAuthenticated();
  }

  isAdmin() {
    return this.auth.getCurrentUser()?.isAdmin === true;
  }

  isUser() {
    const user = this.auth.getCurrentUser();
    return user && user.isAdmin === false;
  }

  getUser() {
    return this.auth.getCurrentUser();
  }

  logout() {
    this.auth.logout();
  }

  buscar(event: any) {
    const texto = event.target.value;
    console.log("Buscando:", texto); // después lo conectamos si querés
  }
}
