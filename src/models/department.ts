import { QrCode } from './qrcode';

export class Department {
	name: String;
	description: String;
	qrCode: [QrCode];
	active: Boolean;
}
