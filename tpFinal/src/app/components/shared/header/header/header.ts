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
protected authService = inject(AuthService);

  logout() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
      this.authService.logout();
    }
  }
}
