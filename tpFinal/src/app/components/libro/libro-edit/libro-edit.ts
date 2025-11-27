import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LibroStore } from '../libro-store';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-libro-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './libro-edit.html',
  styleUrl: './libro-edit.css',
})
export class LibroEdit {

 private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(LibroStore);

  protected libroId = this.route.snapshot.paramMap.get('id');

  //  Form con validadores actualizados
  protected editForm: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(1)]],
    autor: ['', [Validators.required, Validators.minLength(1)]],
    anioPublicacion: [2024, [Validators.required, Validators.min(1000), Validators.max(2100)]],
    genero: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(0)]],
    disponible: [true],
    descripcion: [''],
    portada: ['']
  });

  protected portadaPreview: string | null = null;
  protected loading = false;

  constructor() {
    this.cargarLibro();
  }
//Me carga el libro con los datos cargados
  private async cargarLibro() {
    if (!this.libroId) return;

    this.loading = true;
    try {
      const libro = await firstValueFrom(this.store.getLibroById(this.libroId));

      if (libro) {
        this.editForm.patchValue(libro);
        this.portadaPreview = libro.portada || null;
      } else {
        alert('❌ Libro no encontrado');
        this.router.navigate(['/libro-list']);
      }
    } catch (e) {
      alert('⚠ Error al cargar el libro');
    } finally {
      this.loading = false;
    }
  }

  //  Manejo de imagen cargada
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.portadaPreview = reader.result as string;
      this.editForm.patchValue({ portada: this.portadaPreview });
    };
    reader.readAsDataURL(file);
  }

  //  Guardar cambios
 async onSave() {
  if (this.editForm.invalid || !this.libroId) return;

  try {
    await this.store.updateLibro({ id: this.libroId, ...this.editForm.value });
    alert('✔ Cambios guardados correctamente');
    this.router.navigate(['/libros', this.libroId]);

  } catch (error) {
    console.error(error);
    alert('❌ Error al guardar los cambios');
  }
}

  //  Cancelar y volver
  cancelar() {
    if (confirm('¿Deseas cancelar la edición? Se perderán los cambios.')) {
      this.router.navigate(['/libros', this.libroId]);
    }
  }


isInvalid(controlName: string): boolean {
  const control = this.editForm.get(controlName);
  return !!control && control.invalid && (control.touched || control.dirty);
}


}
