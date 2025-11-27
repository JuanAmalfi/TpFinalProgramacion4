import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Factura } from './factura';

@Injectable({
  providedIn: 'root'
})
export class FacturaClient {
  
  
  private url = "http://localhost:3000/facturas";

  constructor(private http: HttpClient) {}


  //Crear Factura
  crearFactura(factura: Factura) {
    return this.http.post<Factura>(this.url, factura);
  }

//Obtener facturas de un usuario
  getFacturasByUsuario(usuarioId: string | number) {
    return this.http.get<any[]>(`${this.url}?usuarioId=${usuarioId}`);
  }
//Obtener el apartado de un usuario
getByUsuario(usuarioId: string | number) {
  return this.http.get<Factura[]>(`${this.url}?usuarioId=${usuarioId}`);
}

//borrar factura
delete(id: string | number) {
  return this.http.delete(`${this.url}/${id}`);
}



}
