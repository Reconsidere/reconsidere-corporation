import { QrCode } from './qrcode';

export class Department {
	name: String;
	description: String;
	active: Boolean;
	qrCode: [QrCode];
}
