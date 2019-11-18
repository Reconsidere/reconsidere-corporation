import { Material } from './material';

export class QrCode {
	_id: string;
	code: string;
	date: Date;
	confirmedByCorporation: String;
	confirmedByCollector: String;
	observation: String;
	material: Material;
}


