import { QrCode } from "./qrcode";

export class Sale {
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
