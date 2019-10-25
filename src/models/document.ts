export class Document {
	_id: String;
	type: String;
	name: String;
	archive: String;
	daysNotification: Number;
	date: Date;
	expire: Boolean;
}

export namespace Document {
	export enum Type {
		LicencaSanitaria = 'Licença sanitária',
		LicencaAmbiental = 'Licença ambiental',
		NotasFiscais = 'Notas fiscais',
		alvara = 'Alvará',
		documento = 'Documento geral',
		cadri = 'CADRI',
		mtr = 'MTR',
		cdr = 'CDR',
		conama313 = 'CONAMA 313'
	}
}

export namespace Document {
	export enum Expire {
		expire_10 = '10',
		expire_20 = '20',
		expire_30 = '30',
		expire_60 = '60',
		expire_90 = '90',
		expire_120 = '120',
		expire_150 = '150',
		expire_190 = '190'
	}
}

export namespace Document {
	export enum Status {
		ok = 'Válido',
		alert = 'Expirando',
		closed = 'Inválido',
		notExpire = 'Não expira'
	}
}
