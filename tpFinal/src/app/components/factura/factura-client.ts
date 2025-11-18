import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Factura } from './factura';

@Injectable({
  providedIn: 'root'
})
export class FacturaClient {
  
  
  private url = "http://localhost:3000/facturas";

  constructor(private http: HttpClient) {}


  crearFactura(factura: Factura) {
    return this.http.post<Factura>(this.url, factura);
  }


  getFacturasByUsuario(usuarioId: string | number) {
    return this.http.get<any[]>(`${this.url}?usuarioId=${usuarioId}`);
  }
}
