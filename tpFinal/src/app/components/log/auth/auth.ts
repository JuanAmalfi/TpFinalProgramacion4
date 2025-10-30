import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth-service';

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
  protected readonly loginForm=this.fb.group({
    username:['',[Validators.required]],
    password:['',[Validators.required]],
  });
  


   onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      
      const success = this.authService.login(
        username as string, 
        password as string
      );

      if (!success) {
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }



}
