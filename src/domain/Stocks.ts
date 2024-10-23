export interface StockInit {
  uuid?: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  supplier: string;
  description: string;
  category: string;
  created_at: number;
  deleted_at: number;
}

export class DomainStocks {
  uuid?: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  supplier: string;
  description: string;
  category: string;
  created_at: number;
  deleted_at: number;

  constructor(init: StockInit) {
    this.uuid = init.uuid;
    this.name = init.name;
    this.quantity = init.quantity;
    this.unit = init.unit;
    this.price = init.price;
    this.supplier = init.supplier;
    this.description = init.description;
    this.category = init.category;
    this.created_at = init.created_at;
    this.deleted_at = init.deleted_at;
  }
}

export const units = [
  { id: 1, value: "pcs", label: "Pcs (Pieces)" },
  { id: 2, value: "kg", label: "Kg (Kilograms)" },
  { id: 3, value: "g", label: "g (Grams)" },
  { id: 4, value: "ltr", label: "Ltr (Liters)" },
  { id: 5, value: "ml", label: "ml (Milliliters)" },
  { id: 6, value: "box", label: "Box" },
  { id: 7, value: "pack", label: "Pack" },
  { id: 8, value: "dozen", label: "Dozen" },
  { id: 9, value: "meter", label: "Meter" },
  { id: 10, value: "cm", label: "cm (Centimeters)" },
  { id: 11, value: "inch", label: "Inch" },
  { id: 12, value: "sq_meter", label: "sq. meter (Square Meters)" },
  { id: 13, value: "sq_ft", label: "sq. ft (Square Feet)" },
];
