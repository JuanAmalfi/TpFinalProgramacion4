import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserClient } from '../user-client';
import { AuthService } from '../../log/auth/auth-service';
import { User } from '../../log/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-usuario-editar',
  imports: [ReactiveFormsModule],
  templateUrl: './usuario-editar.html',
  styleUrl: './usuario-editar.css',
})
export class UsuarioEditar {

   private route = inject(ActivatedRoute);
  private userClient = inject(UserClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private location = inject(Location);

  usuario = signal<User | null>(null);
  editField = signal<string | null>(null);
  loading = signal(true);
  saving = signal(false);
  isOwnProfile = signal(false);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
    fechaNacimiento: ['', Validators.required],
     // Campos solo para cambio de contraseña
  currentPassword: [''],
  newPassword: [''],
  confirmNewPassword: ['']
  });

  constructor() {
    effect(() => this.cargarUsuario());
  }

  cargarUsuario() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    
    this.userClient.getUserById(id).subscribe({
      next: (data) => {
        this.usuario.set(data);
        this.form.patchValue(data);
        this.loading.set(false);

        const current = this.authService.getCurrentUser();
        this.isOwnProfile.set(current?.id == data.id);
      },
      error: () => alert('Error cargando usuario')
    });
  }


   guardar() {
  if (this.form.invalid || !this.usuario()) {
    this.form.markAllAsTouched();
    return;
  }

  const usuarioActual = this.usuario()!;
  const {
    username,
    email,
    dni,
    fechaNacimiento,
    currentPassword,
    newPassword,
    confirmNewPassword
  } = this.form.getRawValue();  // <- AHORA SIN null

  let finalPassword = usuarioActual.password;

  // ------------------------
  // VALIDACIONES DE PASSWORD
  // ------------------------
  const quiereCambiarPass = currentPassword || newPassword || confirmNewPassword;

  if (quiereCambiarPass) {
    // todos los campos requeridos
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return alert('Debe completar los 3 campos para cambiar la contraseña.');
    }

    if (currentPassword !== usuarioActual.password) {
      return alert('La contraseña actual es incorrecta.');
    }

    if (newPassword.length < 6) {
      return alert('La nueva contraseña debe tener al menos 6 caracteres.');
    }

    if (newPassword === currentPassword) {
      return alert('La nueva contraseña no puede ser igual a la anterior.');
    }

    if (newPassword !== confirmNewPassword) {
      return alert('Las contraseñas nuevas no coinciden.');
    }

    finalPassword = newPassword;
  }

  // ------------------------
  // ARMADO FINAL DE USUARIO
  // ------------------------
  const updated: User = {
    id: usuarioActual.id,
    username,
    email,
    dni,
    fechaNacimiento,
    password: finalPassword,
    isAdmin: usuarioActual.isAdmin
  };

  this.saving.set(true);

  this.userClient.updateUser(updated.id!, updated).subscribe({
    next: () => {
      this.saving.set(false);
      alert('Perfil actualizado correctamente ✔');
      this.location.back();
    },
    error: () => {
      this.saving.set(false);
      alert('Error guardando cambios ❌');
    }
  });
}


  startEdit(field: string) {
    this.editField.set(field);
  }

  cancelEdit() {
    this.editField.set(null);
    this.form.patchValue(this.usuario()!);
  }

  saveField(field: string) {
    if (this.form.get(field)?.invalid) return;

    this.saving.set(true);
    const updatedUser = { ...this.usuario()!, [field]: this.form.get(field)?.value };

    this.userClient.updateUser(updatedUser.id!, updatedUser).subscribe({
      next: () => {
        this.usuario.set(updatedUser);
        this.editField.set(null);
        this.saving.set(false);
      },
      error: () => {
        alert("Error guardando cambios");
        this.saving.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/usuarios/detalle', this.usuario()?.id]);
  }
   cancelar() {
    this.router.navigate(['/usuarios/detalle', this.usuario()?.id]);
  }
}
