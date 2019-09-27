import { Directive, Input, OnChanges, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { WidgetUnitComponent } from '../widget/widget-unit/widget-unit.component';
import { WidgetEntriesManagementGraphicComponent } from '../widget/widget-entries-management-graphic/widget-entries-management-graphic.component';
import { WidgetResidueRegisterGraphicComponent } from '../widget/widget-residue-register-graphic/widget-residue-register-graphic.component';

const components = {
	'widget-unit': WidgetUnitComponent,
	'widget-entries-management-graphic': WidgetEntriesManagementGraphicComponent,
	'widget-residue-register-graphic': WidgetResidueRegisterGraphicComponent
};

@Directive({
	selector: '[appLayoutItem]'
})
export class LayoutItemDirective implements OnChanges {
	@Input() componentRef: string;
	component: ComponentRef<any>;
	constructor(private container: ViewContainerRef, private resolver: ComponentFactoryResolver) {}

	ngOnChanges(): void {
		const component = components[this.componentRef];

		if (component) {
			const factory = this.resolver.resolveComponentFactory<any>(component);
			this.component = this.container.createComponent(factory);
		}
	}
}
