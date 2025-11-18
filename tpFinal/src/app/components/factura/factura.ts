import { FacturaItem } from "./factura-item";

export interface Factura {
  id?: number | string;
  usuarioId: number | string;
  fecha: string;
  total: number;
  items: FacturaItem[];

}
