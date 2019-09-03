import { Profile } from "./myproviders";

export class User {
    _id: string;
    name: string;
    email: string;
    password: string;
    active: boolean
    profile: Profile;

}


export namespace User {
    export enum Profiles {
      Administrator = 'Administrador',
      Coordinator = 'Coordenador',
      Manager = 'Gerente',
      Operational = 'Operacional',
      SuperUser = 'Super usuário'
    }
  }