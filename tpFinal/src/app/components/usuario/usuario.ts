import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserClient } from './user-client';
import { Router } from '@angular/router';
import { UserForm } from './user-form';

@Component({
  selector: 'app-usuario',
  imports: [ReactiveFormsModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario {

  private fb = inject(FormBuilder);
  private userClient = inject(UserClient);
  private router = inject(Router);

  form : FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]], 
    password: ['', [Validators.required, Validators.minLength(6)]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
    fechaNacimiento: ['', Validators.required],
  });

  loading = false;
  error = '';





  register() {
    this.error = '';

    if (this.form.invalid) {
      this.error = 'Revisá los campos, hay datos inválidos.';
      return;
    }

    this.loading = true;

    const payload = this.form.getRawValue() as UserForm;
    const emailToCheck = payload.email.trim().toLowerCase(); // 🔹 normalizamos

    // 🔹 Validar email único
    this.userClient.getUsersByEmail(emailToCheck).subscribe({
      next: users => {
        if (users.length > 0) {
          this.error = 'El email ya está registrado.';
          this.loading = false;
          return;
        }

        // 🔹 Crear usuario con email normalizado
        const newPayload = { ...payload, email: emailToCheck };
        this.userClient.createUser(newPayload).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/auth']);
          },
          error: () => {
            this.error = 'No se pudo crear la cuenta.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'Error validando el email.';
        this.loading = false;
      }
    });
  }


  goToLogin() {
    this.router.navigate(['/auth']);
  }



}
