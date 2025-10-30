import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Libro } from '../libro';
import { AuthService } from '../../log/auth/auth-service';

@Component({
  selector: 'app-libro-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './libro-form.html',  // ← Así
  styleUrl: './libro-form.css'   
})
export class LibroFormComponent {
  private fb = inject(FormBuilder);
  protected authService = inject<AuthService>(AuthService);
  private router = inject(Router);

   protected isAdmin = computed(() => this.authService.isAdmin());

  protected libroForm: FormGroup;

  constructor() {
    this.libroForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(1)]],
      autor: ['', [Validators.required, Validators.minLength(1)]],
      anioPublicacion: ['', [Validators.required, Validators.min(1000), Validators.max(2100)]],
      genero: ['', Validators.required],
      disponible: [true],
      descripcion: ['']
    });
  }

  onSubmit() {
    if (this.libroForm.valid) {
      const libro: Libro = this.libroForm.value;
      console.log('Libro a agregar:', libro);
      alert('✅ Formulario válido! (Por ahora solo se muestra en consola)');
      this.libroForm.reset({ disponible: true });
    } else {
      Object.keys(this.libroForm.controls).forEach(key => {
        this.libroForm.get(key)?.markAsTouched();
      });
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
}