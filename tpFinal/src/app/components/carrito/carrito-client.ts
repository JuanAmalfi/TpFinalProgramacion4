import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CarritoItem } from './carrito-item';

@Injectable({
  providedIn: 'root'
})
export class CarritoClient {
  

 protected readonly url = "http://localhost:3000/carrito";
  protected readonly http = inject(HttpClient);


  // ✔️ Para LibroDetails
  postCarrito(item: CarritoItem) {
    return this.http.post<CarritoItem>(this.url, item);
  }

  // ✔️ Para CarritoList
  getCarritoByUsuario(usuarioId: string | number){
    return this.http.get<CarritoItem[]>(`${this.url}?usuarioId=${usuarioId}`);
  }

  // ✔️ Para eliminar ítems desde el carrito
  deleteCarrito(id: string | number){
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // (Opcional) actualizar cantidad
  updateCarrito(item: CarritoItem, id: string | number) {
    return this.http.put<CarritoItem>(`${this.url}/${id}`, item);
  }


}
