export class Material {
	type: String;
	name: String;
	weight: Number;
	quantity: Number;
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
