import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'searchGraphicEntrie'
})
export class SearchGraphicEntriePipe implements PipeTransform {
	transform(items: any, dateInitial: Date, dateFinal: Date, collector: string, material: string, component: any) {
		if (!dateInitial && !dateFinal && !collector && !material && !items) {
			return items;
		} else if (!dateInitial && !dateFinal && !collector && !material && items) {
			component.generateBarGraph(items);
			return items;
		}
		if (items && items.length) {
			items = items.filter((item) => {
				if (collector && item.collector.name.toLowerCase().indexOf(collector.toLowerCase()) === -1) {
					return false;
				}
				if (dateInitial && dateInitial.getDate() < item.date.getDate()) {
					return false;
				}
				if (dateFinal && dateFinal.getDate() > item.date.getDate()) {
					return false;
				}
				if (material && item.qrCode.material.type.toLowerCase().indexOf(material.toLowerCase()) === -1) {
					return false;
				}

				return true;
			});
			component.generateBarGraph(items);
			return items;
		} else {
			return items;
		}
	}
}
