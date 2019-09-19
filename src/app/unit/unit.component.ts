import { Component, OnInit } from '@angular/core';
import { UnitService } from 'src/services/unit.service';
import { AuthService } from 'src/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as messageCode from 'message.code.json';
import { forEach } from '@angular/router/src/utils/collection';
import { environment } from 'src/environments/environment';
import { Corporation } from 'src/models/corporation';
import { User } from 'src/models/user';

@Component({
	selector: 'app-unit',
	templateUrl: './unit.component.html',
	styleUrls: [ './unit.component.scss' ]
})
export class UnitComponent implements OnInit {
	page: number;
	corporationId: string;
	myUnits: any;
	newUnits: any;
	expandNew;
	expandUnit;

	constructor(private toastr: ToastrService, private unitService: UnitService, private authService: AuthService) {
		this.newUnits = [];
		this.myUnits = [];
	}

	ngOnInit() {
		this.authService.isAuthenticated();
		this.page = 1;
		this.corporationId = this.authService.getCorporationId();
		this.loadUnit();
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

	newItem() {
		var item = new Corporation();
		item.active = true;
		item.classification = Corporation.Classification.Privada;
		var user = new User();
		item.users = [ user ];
		this.newUnits.push(item);
	}

	expandCreate() {
		if (!this.expandNew) {
			this.expandNew = true;
		} else {
			this.expandNew = false;
		}
	}

	expandUnits() {
		if (!this.expandUnit) {
			this.expandUnit = true;
		} else {
			this.expandUnit = false;
		}
	}

	verifyPassword(item) {
		if (item.password === undefined || item.password === '') {
			return;
		}
		item.password = this.authService.encript(item.password);
	}

	veryfyBeforeSave() {
		if (this.newUnits === undefined || this.newUnits.length <= 0) {
			this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
			throw new Error();
		}

		this.newUnits.forEach((unit) => {
			if (unit.users === undefined || unit.users.length <= 0) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			unit.users.forEach((user) => {
				if (user.email === undefined || user.email === undefined) {
					this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
					throw new Error();
				}
				if (user.password === undefined || user.password === undefined) {
					this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
					throw new Error();
				}
			});
		});
	}

	async save() {
		try {
			this.veryfyBeforeSave();
			var unit = await new Promise(async (resolve, reject) => {
				this.authService.addUnit(
					this.authService.getClass(),
					this.corporationId,
					Corporation.Classification.Privada,
					this.newUnits,
					resolve,
					reject
				);
			});
			this.resetUnits(unit);
			this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
		} catch (error) {
			this.toastr.warning(messageCode['ERROR'][error]['summary']);
		}
	}

	async resetUnits(item) {
		this.myUnits = [];
		await  this.loadUnit();
		this.newUnits = [];
	}
}
