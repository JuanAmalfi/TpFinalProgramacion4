export interface CarritoItem {

  id?: number|string;        
  usuarioId: number|string;   
  libroId: number|string;     
  titulo: string;
  autor: string;
    genero: string;             
  anioPublicacion: number; 
  precio: number;
  portada?: string;
  cantidad: number;


}
