import { QrCode } from './qrcode';

export class ResidueArrived {
	date: Date;
	name: String;
	cost: Number;
	typeEntrie: String;
	quantity: Number;
	weight: Number;
	amount: Number;
	qrCode: QrCode;
	observation: String;
	confirmedByCorporation: String;
	confirmedByCollector: String;
}

export namespace ResidueArrived {
	export enum Confirmed {
		Yes = 'Sim',
		No = 'Não',
		contradiction = 'Dados inconsistentes'
	}
}
