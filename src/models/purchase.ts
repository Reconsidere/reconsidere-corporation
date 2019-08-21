import { QrCode } from "./qrcode";

export class Purchase {
    _id: string;
    date: Date;
    name: string;
    cost: number;
    typeEntrie: string;
    quantity: number;
    weight: number;
    amount: number;
    active: boolean;
    qrCode: QrCode;
  }
  