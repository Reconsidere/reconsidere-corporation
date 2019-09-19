import { Location } from './location';
import { Unit } from './unit';
import { User } from './user';
import { MyProviders } from './provider';
import { ResiduesRegister } from './residuesregister';
import { CheckPoints } from './checkpoints';
import { Scheduling } from './scheduling';
import { Entries } from './entries';

export class Corporation {
	_id: string;
	picture: string;
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
	myProviders: [MyProviders];
	residuesRegister: ResiduesRegister;
	checkPoints: CheckPoints;
	schedulings: Scheduling;
	entries: Entries;
	location: Location;
}

export namespace Corporation {
	export enum Classification {
		Cooperativa = 'Cooperativa',
		Coletora = 'Empresa Coletora',
		Beneficiadora = 'Empresa Beneficiadora',
		Privada = 'Empresa Privada',
		Municipio = 'Município'
	}
}
