import { Component, inject, signal } from '@angular/core';
import { Resenia } from '../resenia';
import { ActivatedRoute, Router } from '@angular/router';
import { ReseniaClient } from '../resenia-client';
import { AuthService } from '../../log/auth/auth-service';

@Component({
  selector: 'app-resenia-form',
  imports: [],
  templateUrl: './resenia-form.html',
  styleUrl: './resenia-form.css',
})
export class ReseniaForm {

 private route = inject(ActivatedRoute);
  private router = inject(Router);
  private resenaService = inject(ReseniaClient);
  private auth = inject(AuthService);


protected libroId!: string;
protected biblioId!: string;
  


protected calificacion = signal(0);
  protected comentario = signal('');
  protected editMode = signal(false);
  protected idResena: string | number | null = null;

  constructor() {
    const libroId = this.route.snapshot.paramMap.get('libroId')!;
    this.biblioId = this.route.snapshot.queryParamMap.get('biblioId')!;
    const usuarioId = this.auth.getCurrentUser()!.id;

    this.resenaService.getByUsuarioYLibro(usuarioId!, libroId).subscribe(res => {
      if (res.length > 0) {
        const r = res[0];
        this.idResena = r.id!;
        this.calificacion.set(r.calificacion);
        this.comentario.set(r.comentario);
        this.editMode.set(true);
      }
    });
  }

  guardar() {
    const libroId = this.route.snapshot.paramMap.get('libroId')!;
    const usuarioId = this.auth.getCurrentUser()!.id!;

    const data: Resenia = {
      usuarioId,
      libroId,
      calificacion: this.calificacion(),
      comentario: this.comentario()
    };

    const request = this.editMode()
      ? this.resenaService.update(this.idResena!, data)
      : this.resenaService.post(data);

    request.subscribe(() => {
      alert(this.editMode() ? "Reseña actualizada" : "Reseña guardada");
      this.router.navigate(['/biblioteca', libroId]);
    });
  }



cancelar() {
  this.router.navigate(['/biblioteca', this.biblioId]);
}





}
