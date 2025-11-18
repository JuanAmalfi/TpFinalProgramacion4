export interface BibliotecaItem {
  id?: number | string;
  usuarioId: number | string;
  libroId: number | string;
  titulo: string;
  autor: string;
  genero: string;
  anioPublicacion: number;
  portada: string;
   estado?: 'No leído' | 'Leyendo' | 'Terminado';
}
