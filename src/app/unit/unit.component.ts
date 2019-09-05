import { Component, OnInit } from '@angular/core';
import { UnitService } from 'src/services/unit.service';
import { AuthService } from 'src/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as messageCode from 'message.code.json';
import { forEach } from '@angular/router/src/utils/collection';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-unit',
	templateUrl: './unit.component.html',
	styleUrls: [ './unit.component.scss' ]
})
export class UnitComponent implements OnInit {
	page: number;
	corporationId: string;
	units: any;

	constructor(private toastr: ToastrService, private unitService: UnitService, private authService: AuthService) {}

	ngOnInit() {
		this.authService.isAuthenticated();
		this.page = 1;
		this.corporationId = this.authService.getCorporationId();
		this.loadUnit();
	}

	async loadUnit() {
		var units = undefined;
		try {
			units = await new Promise((resolve, reject) => {
				units = this.unitService.allUnits(this.authService.getClass(), this.corporationId, resolve, reject);
			});

			if (units) {
				this.units = units;
				this.units.forEach((unit) => {
					if (unit.picture === undefined || unit.picture === '' || unit.picture === null) {
						unit.path = `http://localhost:4200/assets/images/no-image.jpg`;
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

	details() {}
}
