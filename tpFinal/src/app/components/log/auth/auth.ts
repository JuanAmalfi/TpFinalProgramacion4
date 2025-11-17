import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {

   protected errorMessage = ''; 

  protected readonly fb=inject(FormBuilder);
  protected readonly authService = inject(AuthService);
  protected readonly router=inject(Router);


  protected readonly loginForm=this.fb.group({
    username:['',[Validators.required]],
    password:['',[Validators.required]],
  });

// Modo actual del formulario: 'login' o 'register'
mode: 'login' | 'register' = 'login'; // valor inicial

// Método para cambiar entre login y registro
toggleMode() {
  this.mode = this.mode === 'login' ? 'register' : 'login';
  this.errorMessage = ''; // limpia cualquier error al cambiar
}



  


  async onSubmit() {
  this.errorMessage = '';

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const { username, password } = this.loginForm.value;

  // 👇 ahora esperamos la respuesta real del AuthService
  const success = await this.authService.login(
    username as string,
    password as string
  );

  if (!success) {
    this.errorMessage = 'Usuario o contraseña incorrectos';
  }
}

   goToRegister() {
    this.router.navigate(['/usuarios/nuevo']); // ⬅️ ruta al formulario
  }



}
