import { QrCode } from "./qrcode";

export class ResiduePerformed {
	date: Date;
	name: String;
	cost: Number;
	typeEntrie: String;
	quantity: Number;
	weight: Number;
	amount: Number;
	qrCode: QrCode;
	observation: String;
}

export namespace ResiduePerformed {
	export enum Confirmed {
		Yes = 'Sim',
		No = 'Não',
		contradiction = 'Contradição'
	}
}
