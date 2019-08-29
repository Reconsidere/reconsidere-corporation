import { Unit } from './unit';
import { User } from './user';

export class ProviderRegistration {
	_id: string;
	company: string;
	cnpj: string;
	tradingName: string;
	active: boolean;
	class: string;
	phone: number;
	email: string;
	classification: string;
	cellPhone: number;
	creationDate: Date;
	activationDate: Date;
	verificationDate: Date;
	units: [Unit];
	users: [User];
}

export namespace ProviderRegistration {
	export enum Classification {
		Provider = 'Fornecedor'
	}
}
