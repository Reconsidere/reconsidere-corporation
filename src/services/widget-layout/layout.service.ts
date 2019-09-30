import { Injectable } from '@angular/core';
import { GridsterConfig, GridsterItem, DisplayGrid, CompactType, GridType } from 'angular-gridster2';
import { UUID } from 'angular2-uuid';

export interface IComponent {
	id: string;
	componentRef: string;
}

@Injectable({
	providedIn: 'root'
})
export class LayoutService {
	public layout: GridsterItem[] = [];
	public components: IComponent[] = [];
	dropId: string;
	items: any;

	public options: GridsterConfig = {
		draggable: {
			enabled: true,
			dropOverItems: true
		},
		resizable: {
			enabled: true,
			handles: {
				s: true,
				e: true,
				n: true,
				w: true,
				se: true,
				ne: true,
				sw: true,
				nw: true
			}
		},
		margin: 10,
		displayGrid: DisplayGrid.None,
		compactType: CompactType.CompactLeftAndUp,
		pushItems: true,
		pushResizeItems: false,
		mobileBreakPoint: 600,
		isMobile: false,
		swap: true,
		mobileModeEnabled: true,
		width: 'auto',
		//gridType: 'scrollVertical',
		pushDirections: { north: true, east: true, south: true, west: true }
	};
	constructor() {
		this.items = [];
		if (this.items || this.items.length <= 0) {
			var cont = 1;
			var size = 15;
			while (cont <= 3) {
				this.layout.push({
					cols: size,
					id: UUID.UUID(),
					rows: 5,
					x: 0,
					y: 0
				});
				cont++;
				size--;
			}

			var widgets = [ 'widget-unit', 'widget-entries-management-graphic', 'widget-residue-register-graphic' ];
			var updateIdx = 0;
			widgets.forEach((dragId) => {
				const componentItem: IComponent = {
					id: this.layout[updateIdx].id,
					componentRef: dragId
				};
				this.components = Object.assign([], this.components, { [updateIdx]: componentItem });
				updateIdx++;
			});
		} else {
		}
	}

	addItem(): void {
		this.layout.push({
			cols: 5,
			id: UUID.UUID(),
			rows: 5,
			x: 0,
			y: 0
		});
	}
	deleteItem(idObject: any): void {
		var id;
		if (typeof idObject === 'object') {
			id = idObject.id;
		} else {
			id = idObject;
		}
		const item = this.layout.find((d) => d.id === id);
		this.layout.splice(this.layout.indexOf(item), 1);
		const comp = this.components.find((c) => c.id === id);
		this.components.splice(this.components.indexOf(comp), 1);
	}

	setDropId(dropId: string): void {
		this.dropId = dropId;
	}

	dropItem(dragId: string): void {
		const { components } = this;
		const comp: IComponent = components.find((c) => c.id === this.dropId);
		const updateIdx: number = comp ? components.indexOf(comp) : components.length;
		const componentItem: IComponent = {
			id: this.dropId,
			componentRef: dragId
		};
		this.components = Object.assign([], this.components, { [updateIdx]: componentItem });
	}

	getComponentRef(id: string): string {
		const comp = this.components.find((c) => c.id === id);
		return comp ? comp.componentRef : null;
	}
}
