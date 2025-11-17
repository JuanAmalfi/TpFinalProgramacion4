export interface CarritoItem {

  id?: number|string;        
  usuarioId: number|string;   
  libroId: number|string;     
  titulo: string;
  autor: string;
  precio: number;
  portada?: string;
  cantidad: number;


}
