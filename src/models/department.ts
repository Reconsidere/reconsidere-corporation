import { QrCode } from './qrcode';

export class Department {
	_id: string;
	name: string;
	description: string;
	active: boolean;
	qrCode: [QrCode];
	isChanged:boolean;
}
