import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { Corporation } from 'src/models/corporation';
import { environment } from 'src/environments/environment';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { UnitComponent } from '../unit/unit.component';
import { UnitService } from 'src/services/unit.service';
import * as messageCode from 'message.code.json';
import { ToastrService } from 'ngx-toastr';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { LayoutService, IComponent } from 'src/services/widget-layout/layout.service';

@Component({
	selector: 'app-startcenter',
	templateUrl: './startcenter.component.html',
	styleUrls: [ './startcenter.component.scss' ]
})
export class StartcenterComponent implements OnInit {
	page: number;
	corporationId: string;
	expand;

	constructor(private layoutService: LayoutService, private authService: AuthService) {}
	get options(): GridsterConfig {
		return this.layoutService.options;
	}
	get layout(): GridsterItem[] {
		return this.layoutService.layout;
	}

	get components(): IComponent[] {
		return this.layoutService.components;
	}

	ngOnInit() {
		this.authService.isAuthenticated();
		this.page = 1;
		this.corporationId = this.authService.getCorporationId();
	}

	expands() {
		if (!this.expand) {
			this.expand = true;
		} else {
			this.expand = false;
		}
	}
}
