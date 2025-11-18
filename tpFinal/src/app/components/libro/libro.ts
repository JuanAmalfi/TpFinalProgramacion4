export interface Libro {
id?:string | number;
titulo:string;
autor:string;
anioPublicacion:number;
genero:string;
disponible:boolean;
descripcion?:string;
precio:number;
portada?:string;

promedioCalificacion?: number;

    
}
