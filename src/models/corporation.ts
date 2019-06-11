import { Unit } from "./unit";
import { User } from "./user";

export class Corporation {
    _id: string;
    company: string;
    cnpj: string;
    tradingName: string;
    active: boolean;
    phone: number;
    cellPhone: number;
    class: string;
    creationDate: Date;
    activationDate: Date;
    verificationDate: Date;
    units: [Unit];
    users: [User];
    email: string;
    classification: string;
}