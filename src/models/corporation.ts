import { Location } from "./location";
import { Unit } from "./unit";
import { User } from "./user";

export class Corporation {
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
    location: Location;
    units: [Unit];
    users: [User];
}


export namespace Corporation {
    export enum Classification {
        Comercio = 'Comércio Comum',
        Cooperativa = 'Cooperativa',
        Coletora = 'Empresa Coletora',
        Beneficiadora = 'Empresa Beneficiadora',
        Municipio = 'Município',
        Privada = 'Empresa Privada'
    }
}