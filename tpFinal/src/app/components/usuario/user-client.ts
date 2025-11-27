import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserForm } from './user-form';
import { User } from '../log/user';

@Injectable({
  providedIn: 'root'
})
export class UserClient {
  
protected readonly url = "http://localhost:3000/users";
  protected readonly http = inject(HttpClient);

  createUser(data: UserForm) {
    const payload: User = {
      ...data,
       email: data.email.trim().toLowerCase(),
      isAdmin: false  // SIEMPRE usuario normal
    };

    return this.http.post<User>(this.url, payload);
  }

  getUsers() {
    return this.http.get<User[]>(this.url);
  }

  getUserById(id: number | string) {
    return this.http.get<User>(`${this.url}/${id}`);
  }
validateEmailNotTaken(email: string) {
  return this.http.get<User[]>(`${this.url}?email=${encodeURIComponent(email)}`);
}

 getUsersByEmail(email: string) {
    const normalized = encodeURIComponent(email.trim().toLowerCase()); 
    return this.http.get<User[]>(`${this.url}?email=${normalized}`);
  }

  deleteUser(id:string|number){
    return this.http.delete<User>(`${this.url}/${id}`);
  }
  updateUser(id:string|number, user:User){
    return this.http.put<User>(`${this.url}/${id}`,user);
  }

}
