import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Resenia } from './resenia';

@Injectable({
  providedIn: 'root'
})
export class ReseniaClient {
    private http = inject(HttpClient);
  private url = "http://localhost:3000/resenas";

  getByLibro(libroId: string | number) {
    return this.http.get<Resenia[]>(`${this.url}?libroId=${libroId}`);
  }

  getByUsuarioYLibro(usuarioId: string | number, libroId: string | number) {
    return this.http.get<Resenia[]>(`${this.url}?usuarioId=${usuarioId}&libroId=${libroId}`);
  }

  post(resena: Resenia) {
    return this.http.post<Resenia>(this.url, resena);
  }

  update(id: string | number, resena: Resenia) {
    return this.http.put<Resenia>(`${this.url}/${id}`, resena);
  }

  delete(id: string | number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  getAll() {
    return this.http.get<Resenia[]>(this.url);
  }
}
