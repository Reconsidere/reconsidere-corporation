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
import { LayoutService, IComponent } from 'src/services/layout.service';

@Component({
	selector: 'app-startcenter',
	templateUrl: './startcenter.component.html',
	styleUrls: [ './startcenter.component.scss' ]
})
export class StartcenterComponent implements OnInit {
	page: number;
	corporation: any;
	myUnits: any;
	corporationId: string;
	itemListUnits: any;
	NoImageUrl = `http://localhost:4200/assets/images/no-image.png`;

	constructor(
		private layoutService: LayoutService,
		private toastr: ToastrService,
		private authService: AuthService,
		private unitService: UnitService
	) {}
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
		this.itemListUnits = [];
		this.corporationId = this.authService.getCorporationId();
		this.load();
	}

	async load() {
		await this.loadValues();
		await this.loadUnit();
	}

	async loadValues() {
		this.corporation = await new Promise(async (resolve, reject) => {
			this.authService.getOrganization(this.authService.getClass(), resolve, reject);
		});

		if (
			this.corporation.picture === undefined ||
			this.corporation.picture === '' ||
			this.corporation.picture === null
		) {
			this.corporation.path = this.NoImageUrl;
		} else {
			this.corporation.path = `${environment.database.uri}/${this.corporation.picture}`;
		}
	}

	async loadUnit() {
		var myUnits = undefined;
		try {
			myUnits = await new Promise((resolve, reject) => {
				myUnits = this.unitService.allUnits(this.authService.getClass(), this.corporationId, resolve, reject);
			});

			if (myUnits) {
				this.myUnits = myUnits;
				this.myUnits.forEach((unit) => {
					if (unit.picture === undefined || unit.picture === '' || unit.picture === null) {
						unit.path = this.NoImageUrl;
					} else {
						unit.path = `${environment.database.uri}/${unit.picture}`;
					}
				});
			} else {
				this.toastr.error(messageCode['WARNNING']['WRE016']['summary']);
			}
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}
}
