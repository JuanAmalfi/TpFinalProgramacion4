import { Component, inject, signal } from '@angular/core';
import { FacturaClient } from '../factura-client';
import { AuthService } from '../../log/auth/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-factura-list',
  imports: [CommonModule],
  templateUrl: './factura-list.html',
  styleUrl: './factura-list.css',
})
export class FacturaList {

 private facturaService = inject(FacturaClient);
  private auth = inject(AuthService);

  protected facturas = signal<any[]>([]);
  protected loading = signal<boolean>(true);
  protected error = signal<string | null>(null);

  constructor() {
    const usuario = this.auth.getCurrentUser();

    if (!usuario) {
      this.error.set('Debes iniciar sesión para ver tus facturas.');
      this.loading.set(false);
      return;
    }

    this.facturaService.getFacturasByUsuario(usuario.id!).subscribe({
      next: (data) => {
        this.facturas.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar las facturas.');
        this.loading.set(false);
      }
    });
  }




}
