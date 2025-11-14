import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Libro } from './libro';

@Injectable({
  providedIn: 'root'
})
export class LibroClient {

  protected readonly url="http://localhost:3000/libros";
  protected readonly http=inject(HttpClient);



postLibro(libro:Libro){
  return this.http.post<Libro>(this.url,libro);
}
getLibros(){
  return this.http.get<Libro[]>(this.url);  
}
deleteLibro(id:string | number){
  return this.http.delete<void>(`${this.url}/${id}`);
}
updateLibro(libro:Libro, id:string | number){
  return this.http.put<Libro>(`${this.url}/${id}`,libro);
}
getLibroById(id:string | number){
  return this.http.get<Libro>(`${this.url}/${id}`);
}





  
}
