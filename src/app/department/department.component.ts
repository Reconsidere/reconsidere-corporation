import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DepartamentService } from 'src/services/departament.service';
import { AuthService } from 'src/services/auth.service';
import * as messageCode from 'message.code.json';
import { Department } from 'src/models/department';

@Component({
	selector: 'app-department',
	templateUrl: './department.component.html',
	styleUrls: [ './department.component.scss' ]
})
export class DepartmentComponent implements OnInit {
	page: number;
	corporationId: string;
	departments: any;
	departmentsOriginal: any;

	constructor(
		private toastr: ToastrService,
		private departmentService: DepartamentService,
		private authService: AuthService
	) {}

	ngOnInit() {
		this.authService.isAuthenticated();
		this.page = 1;
		this.corporationId = this.authService.getCorporationId();
		this.loadDepartments();
	}

	async loadDepartments() {
		var departments = undefined;
		try {
			departments = await new Promise((resolve, reject) => {
				departments = this.departmentService.allDepartaments(this.corporationId, resolve, reject);
			});

			if (departments) {
				this.departments = departments;
				this.departmentsOriginal = departments;
			} else {
				this.departments = [];
				this.departmentsOriginal = [];
			}
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	resetDepartments(items) {
		this.departments = items;
		this.departmentsOriginal = items;
	}

	remove(department) {
		this.departments.forEach((item, index) => {
			if (item === department) {
				item.active = false;
				return;
			}
		});
	}

	newItem() {
		var departament = new Department();
		departament.active = true;
		this.departments.push(departament);
	}

	veryfyBeforeSave() {
		if (this.departments === undefined || this.departments.length <= 0) {
			this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
			throw new Error();
		}
		this.departments.forEach((department) => {
			if (department.name === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (department.qrCode !== undefined && department.qrCode.length > 0) {
				department.qrCode.forEach((qrCode) => {
					if (qrCode.code === undefined) {
						this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
						throw new Error();
					}
					if (qrCode.material === undefined) {
						this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
						throw new Error();
					}
					if (
						qrCode.material.type === undefined ||
						qrCode.material.name === undefined ||
						qrCode.material.weight === undefined ||
						qrCode.material.quantity >= 0
					) {
						this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
						throw new Error();
					}
				});
			}
		});
	}

	removeNonChangeds() {
		this.departments.forEach((department, index) => {
			this.departmentsOriginal.forEach((original) => {
				if (department._id !== undefined) {
					if (department._id === original._id && department === original) {
						this.departments[index].splice(index, 1);
					}
				}
			});
		});
	}

	async save() {
		try {
			this.removeNonChangeds();
			this.veryfyBeforeSave();
			let promise = await new Promise(async (resolve, reject) => {
				this.departmentService.addOrUpdate(this.corporationId, this.departments, resolve, reject);
			});
			this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
			this.resetDepartments(promise);
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}
}
