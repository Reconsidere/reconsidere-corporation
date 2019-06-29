export class Material {
	type: String;
	name: String;
	weight: Number;
	quantity: Number;
	unity:String;
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
