export interface User {
    id?: string|number;
    username: string;
    email:string;
    password: string;
    isAdmin: boolean;
    dni:string;
    fechaNacimiento:string;
}
