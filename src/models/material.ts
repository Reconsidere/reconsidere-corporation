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
