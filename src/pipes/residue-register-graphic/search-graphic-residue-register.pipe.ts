import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'searchGraphicResidueRegister'
})
export class SearchGraphicResidueRegisterPipe implements PipeTransform {
	transform(
		items: any,
		dateInitial: Date,
		dateFinal: Date,
		department: string,
		material: string,
		unity: string,
		component: any
	) {
		if (!dateInitial && !dateFinal && !department && !material && !unity && !items) {
			return items;
		} else if (!dateInitial && !dateFinal && !department && !material && !unity && items) {
			var registerResidues = new Object({
				departments: items
			});
			component.generatePieGraph(registerResidues);
			return items;
		}
		if (items && items.length) {
			items = items.filter((item) => {
				if (department && item.name.toLowerCase().indexOf(department.toLowerCase()) === -1) {
					return false;
				}
				for (var x = 0; item.qrCode.length > x; x++) {
					if (dateInitial && dateInitial.getDate() < item.qrCode[x].date.getDate()) {
						return false;
					}
					if (dateFinal && dateFinal.getDate() > item.qrCode[x].date.getDate()) {
						return false;
					}
					if (unity && item.qrCode[x].material.unity.toLowerCase().indexOf(unity.toLowerCase()) === -1) {
						return false;
					}
					if (material && item.qrCode[x].material.name.toLowerCase().indexOf(material.toLowerCase()) === -1) {
						return false;
					}
				}
				return true;
			});
			var registerResidues = new Object({
				departments: items
			});
			component.generatePieGraph(registerResidues);
			return items;
		} else {
			return items;
		}
	}
}
