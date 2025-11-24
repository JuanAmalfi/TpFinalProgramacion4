import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BibliotecaClient } from '../biblioteca-client';
import { AuthService } from '../../log/auth/auth-service';
import { BibliotecaItem } from '../biblioteca-item';
import { ReseniaClient } from '../../resenia/resenia-client';
import { Resenia } from '../../resenia/resenia';

@Component({
  selector: 'app-biblioteca-details',
  imports: [],
  templateUrl: './biblioteca-details.html',
  styleUrl: './biblioteca-details.css',
})
export class BibliotecaDetails {


 private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bibliotecaService = inject(BibliotecaClient);
  private resenaService = inject(ReseniaClient);
  private auth = inject(AuthService);

  protected libro = signal<BibliotecaItem | null>(null);
  protected resena = signal<Resenia | null>(null);
  protected estrellas = signal<string[]>([]);
  protected estadoLectura = signal<'No leído' | 'Leyendo' | 'Terminado'>('No leído');


  protected mostrarModal = signal(false);
  private pendienteNavegar = false;


  constructor() {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {

    this.bibliotecaService.getByUsuario(this.auth.getCurrentUser()?.id!)
      .subscribe(biblio => {

        const item = biblio.find(x => String(x.libroId) === String(id)); 

        if (item) {
          this.libro.set(item);
           this.estadoLectura.set(item.estado ?? 'No leído'); 
          this.cargarResena(item.libroId);
        }
      });
  }
}

  // Cargar reseña existente
  // Cargar reseña EXISTENTE del usuario logueado para este libro
cargarResena(libroId: string | number) {
  const usuarioId = this.auth.getCurrentUser()?.id;
  if (!usuarioId) return;

  this.resenaService.getByUsuarioYLibro(usuarioId, libroId).subscribe(res => {
    if (res.length > 0) {
      const r = res[0];
      this.resena.set(r);
      this.generarEstrellas(r.calificacion);
    } else {
      // 👇 importante: limpiar si este usuario NO tiene reseña
      this.resena.set(null);
      this.estrellas.set([]);
    }
  });
}


  // Crear o editar reseña
 agregarResena() {
    const estado = this.estadoLectura();

    // SI NO ESTÁ TERMINADO → mostrar modal
    if (estado !== 'Terminado') {
      this.pendienteNavegar = true;
      this.mostrarModal.set(true);
      return;
    }

    // SI ESTÁ TERMINADO → navegar normal
    this.router.navigate(['/resena-form', this.libro()!.libroId]);
  }


 confirmarResena() {
    this.mostrarModal.set(false);
    if (this.pendienteNavegar) {
      this.router.navigate(['/resena-form', this.libro()!.libroId]);
    }
  }





  // Eliminar reseña
  eliminarResena() {
    if (!this.resena()?.id) return;

    if (!confirm("¿Seguro que deseas eliminar tu reseña?")) return;

    this.resenaService.delete(this.resena()!.id!).subscribe(() => {
      this.resena.set(null);
      this.estrellas.set([]);
      alert("Reseña eliminada");
    });
  }

  // Estrellas
  generarEstrellas(calificacion: number) {
    const llenas = Math.round(calificacion);
    this.estrellas.set(
      Array(5).fill('').map((_, i) => i < llenas ? '★' : '☆')
    );
  }

  volver() {
    this.router.navigate(['/biblioteca']);
  }

  cambiarEstado(estado: 'No leído' | 'Leyendo' | 'Terminado') {
  if (!this.libro()) return;

  this.estadoLectura.set(estado);

  // Actualizar en db.json
  this.bibliotecaService
    .updateEstado(this.libro()!.id!, estado)
    .subscribe(() => {
      console.log("Estado actualizado!");
    });
}


  cerrarModal() {
    this.mostrarModal.set(false);
    this.pendienteNavegar = false;
  }


}
