import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DepartamentService } from 'src/services/departament.service';
import { AuthService } from 'src/services/auth.service';
import * as messageCode from 'message.code.json';
import { Department } from 'src/models/department';
import { Material } from 'src/models/material';

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
	) {
		this.departments = [];
		this.departmentsOriginal = [];
	}

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
				departments = this.departmentService.allDepartaments(this.authService.getClass(), this.corporationId, resolve, reject);
			});

			if (departments) {
				this.departments = departments;
				this.departmentsOriginal = JSON.parse(JSON.stringify(departments));
			}
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	resetDepartments(items) {
		this.departments = items;
		this.departmentsOriginal = JSON.parse(JSON.stringify(items));
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
		});
	}

	removeNonChangeds(): Boolean {
		var existchange = false;
		if (this.departmentsOriginal === undefined || this.departmentsOriginal.length <= 0) {
			return true;
		}
		if (this.departments.length > this.departmentsOriginal.length) {
			existchange = true;
		}
		var changed = false;
		this.departments.forEach((department, index) => {
			changed = false;
			this.departmentsOriginal.forEach((original) => {
				if (department._id !== undefined) {
					if (department._id === original._id) {
						if (
							department.name !== original.name ||
							department.description !== original.description ||
							department.active !== original.active
						) {
							existchange = true;
							changed = true;
						} else {
						}
					}
				}
			});
			if (!changed) {
				this.departments.splice(index, 1);
			}
		});
		return existchange;
	}

	async save() {
		try {
			if (!this.removeNonChangeds()) {
				this.loadDepartments();
				this.toastr.warning(messageCode['WARNNING']['WRE020']['summary']);
				return;
			}
			this.veryfyBeforeSave();
			var departaments = await new Promise(async (resolve, reject) => {
				this.departmentService.addOrUpdate(this.authService.getClass(), this.corporationId, this.departments, resolve, reject);
			});
			this.resetDepartments(departaments);
			this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
		} catch (error) {
			this.toastr.warning(messageCode['ERROR'][error]['summary']);
		}
	}
}
