import { Unit } from './unit';
import { User } from './user';
import { Provider } from '@angular/core';
import { ResiduesRegister } from './residuesregister';
import { CheckPoints } from './checkpoints';
import { Scheduling } from './scheduling';
import { Entries } from './entries';

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
	myProviders: [Provider];
	residuesRegister: ResiduesRegister;
	checkPoints: CheckPoints;
	schedulings: Scheduling;
	entries: Entries;
}

export namespace ProviderRegistration {
	export enum Classification {
		Provider = 'Fornecedor'
	}
}
