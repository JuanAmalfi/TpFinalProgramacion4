import { inject, Injectable } from '@angular/core';
import { User } from '../user';
import { AuthUser } from '../auth-user';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly router = inject(Router);

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Usuarios hardcodeados
  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      isAdmin: true
    },
    {
      id: 2,
      username: 'usuario',
      password: 'user123',
      isAdmin: false
    }
  ];

  constructor() {
   
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      const authUser: AuthUser = {
        id: user.id!,
        username: user.username,
        isAdmin: user.isAdmin
      };
      
      this.currentUserSubject.next(authUser);
     

      this.router.navigate(['/libro-list']);
      
      return true;
    }

    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth']);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.isAdmin === true;
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }
}