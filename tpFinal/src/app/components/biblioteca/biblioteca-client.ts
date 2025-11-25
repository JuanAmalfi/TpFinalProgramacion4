import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BibliotecaItem } from './biblioteca-item';

@Injectable({
  providedIn: 'root'
})
export class BibliotecaClient {
  
  private http = inject(HttpClient);
  private url = "http://localhost:3000/biblioteca";

 addLibro(item: BibliotecaItem) {
  const nuevo = { 
    ...item,
    estado: item.estado ?? 'No leído' // 👈 setea default
  };
  return this.http.post<BibliotecaItem>(this.url, nuevo);
}


  // 📌 Obtener biblioteca completa
  getAll() {
    return this.http.get<BibliotecaItem[]>(this.url);
  }

  // 📌 Obtener biblioteca de un usuario
  getByUsuario(usuarioId: string | number) {
    return this.http.get<BibliotecaItem[]>(`${this.url}?usuarioId=${usuarioId}`);
  }

  updateEstado(id: string | number, estado: string) {
  return this.http.patch(`${this.url}/${id}`, { estado });
}
delete(id: string | number) {
  return this.http.delete(`${this.url}/${id}`);
}


}
