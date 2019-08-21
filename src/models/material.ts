export class Material {
	_id: string;
	type: string;
	name: string;
	weight: number;
	quantity: number;
	unity:string;
	active: boolean;
}

export namespace Material {
	export enum Type {
		Paper = 'Papel',
		Plastic = 'Plástico',
		Glass = 'Vidro',
		Metal = 'Metal',
		Isopor = 'Isopor',
		Tetrapack = 'Tetrapack'
	}
}

export namespace Material {
	export enum Unit	{
		Kg = 'Kg',
		L = 'l',
		T = 'T',
	}
}


export namespace Hierarchy {
	export enum Classification {
	  Solid = 'Sólido',
	  SemiSolid = 'Semi-Sólido',
	  Liquid = 'Liquido'
	}
  }
  export namespace Hierarchy {
	export enum Category {
	  Recyclable = 'Reciclável',
	  Compostable = 'Compostável',
	  NotRecycable = 'Não reciclável',
	  Dangerous = 'Perigoso'
	}
  }
  
  export namespace Hierarchy {
	export enum Material {
	  Paper = 'Papel',
	  Plastic = 'Plástico',
	  Glass = 'Vidro',
	  Metal = 'Metal',
	  Isopor = 'Isopor',
	  Tetrapack = 'Tetrapack'
	}
  
	export enum types {
	  paper = 'paper',
	  plastic = 'plastic',
	  glass = 'glass',
	  metal = 'metal',
	  isopor = 'isopor',
	  tetrapack = 'tetrapack'
	}
}
