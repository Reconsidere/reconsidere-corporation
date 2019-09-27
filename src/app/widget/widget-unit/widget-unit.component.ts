import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/services/auth.service';
import { UnitService } from 'src/services/unit.service';
import { environment } from 'src/environments/environment';
import * as messageCode from 'message.code.json';

@Component({
	selector: 'app-widget-unit',
	templateUrl: './widget-unit.component.html',
	styleUrls: [ './widget-unit.component.scss' ]
})
export class WidgetUnitComponent implements OnInit {
	corporation;
	myUnits;
	NoImageUrl = `http://localhost:4200/assets/images/no-image.png`;
	corporationId: string;

	constructor(private toastr: ToastrService, private authService: AuthService, private unitService: UnitService) {}

	ngOnInit() {
		this.authService.isAuthenticated();
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
