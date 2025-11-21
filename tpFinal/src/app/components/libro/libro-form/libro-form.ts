import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Libro } from '../libro';
import { AuthService } from '../../log/auth/auth-service';
import { LibroStore } from '../libro-store';

@Component({
  selector: 'app-libro-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './libro-form.html',  // ← Así
  styleUrl: './libro-form.css'   
})
export class LibroFormComponent {
   private fb = inject(FormBuilder);
  private router = inject(Router);
  private store = inject(LibroStore);
  protected authService = inject(AuthService);

  protected isAdmin = computed(() => this.authService.isAdmin());
  protected portadaPreview: string | null = null;

  protected libroForm: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(1)]],
    autor: ['', [Validators.required, Validators.minLength(1)]],
    anioPublicacion: [2024, [Validators.required, Validators.min(1000), Validators.max(2026)]],
    genero: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(0)]],
    disponible: [true],
    descripcion: [''],
    portada: ['']
  });

  // ✅ Capturar y convertir imagen
  onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result as string;
    this.portadaPreview = base64;
    // 👇 Guardamos el base64 directamente en el form
    this.libroForm.patchValue({ portada: base64 });
  };
  reader.readAsDataURL(file);
}

  // ✅ Enviar al store
  onSubmit() {
    if (this.libroForm.valid) {
      const libro: Libro = this.libroForm.value;
      console.log('📸 Portada enviada:', libro.portada);
      this.store.addLibro(libro);
      alert('✅ Libro agregado correctamente');
      this.libroForm.reset({ disponible: true });
      this.portadaPreview = null;
      this.router.navigate(['/libro-list']);
    } else {
      Object.keys(this.libroForm.controls).forEach(key =>
        this.libroForm.get(key)?.markAsTouched()
      );
    }
  }

  onCancel() {
    if (confirm('¿Está seguro de cancelar? Los cambios no se guardarán.')) {
      this.router.navigate(['/libro-list']);
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  isInvalid(control: string) {
  const c = this.libroForm.get(control);
  return c?.invalid && c?.touched;
}
}