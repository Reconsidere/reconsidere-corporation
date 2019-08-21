import { Purchase } from "./purchase";
import { Sale } from "./sale";

export class Entries {
  _id: string;
  purchase: [Purchase];
  sale: [Sale];


}


export namespace EntriesTypes {
  export enum Type {
    Input = 'Entrada',
    Output = 'Saída',
  }
}

export namespace EntriesTypes {
  export enum types {
    purchase = 'purchase',
    sale = 'sale'
  }
}

export namespace EntriesTypes {
  export enum TypeEntrie {
    Material = 'Material',
  }
}

