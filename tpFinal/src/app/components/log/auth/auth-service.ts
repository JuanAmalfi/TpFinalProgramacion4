import { inject, Injectable } from '@angular/core';
import { User } from '../user';
import { AuthUser } from '../auth-user';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly router = inject(Router);
  private http=inject(HttpClient)

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();



  private apiUrl = 'http://localhost:3000/users';

 constructor() {
    // 🔥 Restaurar sesión si existe en localStorage
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      this.currentUserSubject.next(JSON.parse(saved));
    }
  }




  

 // 🔐 Login: email o username + persistencia
  async login(identifier: string, password: string): Promise<boolean> {
    try {
      const users = await firstValueFrom(this.http.get<User[]>(this.apiUrl));

      const user = users.find(
        u => (u.email === identifier || u.username === identifier) && u.password === password
      );

      if (!user) return false;

      const authUser: AuthUser = {
        id: user.id!,
        username: user.username,
        isAdmin: user.isAdmin
      };

      // Guardar sesión
      this.currentUserSubject.next(authUser);
      localStorage.setItem('currentUser', JSON.stringify(authUser));

      this.router.navigate(['/home']);
      return true;

    } catch (e) {
      console.error('Error en login:', e);
      return false;
    }
  }



  // 🔓 Logout
  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth']);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

   isAdmin(): boolean {
    return this.currentUserSubject.value?.isAdmin === true;
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }
}
