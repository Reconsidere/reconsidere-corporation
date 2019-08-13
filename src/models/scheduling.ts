import { QrCode } from "./qrcode";

export class Scheduling {
	_id: string;
	hour: Date;
	date: Date;
	collector: Scheduling.Collector;
	active: boolean;
	qrCode: [QrCode];
}

export namespace Scheduling {
	export class Collector {
		_id: string;
		company: string;
		cnpj: string;
		tradingName: string;
		active: boolean;
		phone: number;
		cellPhone: number;
		class: string;
		email: string;
	}
}
