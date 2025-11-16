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



  

 async login(email: string, password: string): Promise<boolean> {
  try {
    const users = await firstValueFrom(
      this.http.get<User[]>(`${this.apiUrl}?email=${encodeURIComponent(email)}`)
    );

    if (users.length !== 1) return false;

    const user = users[0];

    if (user.password !== password) return false;

    const authUser: AuthUser = {
      id: user.id!,
      username: user.username,
      isAdmin: user.isAdmin
    };

    this.currentUserSubject.next(authUser);
    this.router.navigate(['/libro-list']);
    return true;

  } catch (e) {
    console.error(e);
    return false;
  }
}


  logout(): void {
    this.currentUserSubject.next(null);
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
