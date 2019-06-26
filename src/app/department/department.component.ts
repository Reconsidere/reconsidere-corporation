import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DepartamentService } from 'src/services/departament.service';
import { AuthService } from 'src/services/auth.service';
import * as messageCode from 'message.code.json';
import { Department } from 'src/models/department';
import { QrCode } from 'src/models/qrcode';
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
	materialsType: any;

	constructor(
		private toastr: ToastrService,
		private departmentService: DepartamentService,
		private authService: AuthService
	) {
		this.departments = [];
		this.departmentsOriginal = [];
		this.materialsType = Object.values(Material.Type);
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
				departments = this.departmentService.allDepartaments(this.corporationId, resolve, reject);
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

	addMaterial(item) {
		if (item) {
			if (item.qrCode === undefined) {
				item.qrCode = [];
			}
			var qrCode = new QrCode();
			qrCode.code = this.uuidv4(); /** Verificar como será o qrcde por hora apenas um cpodigo gerado na mão para teste */
			qrCode.material = new Material();
			item.qrCode.push(qrCode);
		}
	}

	/**
	 * Utilizado por hora para gerar ids unicos para cada produto no lugar do Qr code
	 */
	uuidv4() {
		return '124AbCDq-0001-4120-YUZP-OIMVCx214790'.replace(/[xy]/g, function(c) {
			var r = (Math.random() * 16) | 0,
				v = c == 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
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

	removeNonChangeds(): Boolean {
		if (this.departmentsOriginal === undefined || this.departmentsOriginal.length <= 0) {
			return true;
		}
		var existchange = false;
		this.departments.forEach((department, index) => {
			this.departmentsOriginal.forEach((original) => {
				if (department._id !== undefined) {
					if (department._id === original._id) {
						if (
							department.name !== original.name ||
							department.description !== original.description ||
							department.active !== original.active
						) {
							existchange = true;
						} else {
							this.departments.splice(index, 1);
						}
						if (department.qrCode !== undefined && department.qrCode.length > 0) {
							department.qrCode.forEach((qrCode, i) => {
								original.qrCode.forEach((originalQrCode) => {
									if (qrCode.code !== originalQrCode.code) {
										existchange = true;
									} else {
										department.qrCode.splice(i, 1);
									}
									if (qrCode.material !== undefined && qrCode) {
										qrCode.material.forEach((material, ind) => {
											originalQrCode.material.forEach((originalMaterial) => {
												if (
													material.type !== originalMaterial.type ||
													material.name !== originalMaterial.name ||
													material.weight !== originalMaterial.weight ||
													material.quantity !== originalMaterial.quantity
												) {
													existchange = true;
												} else {
													qrCode.material.splice(ind, 1);
												}
											});
										});
									}
								});
							});
						}
					}
				}
			});
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
				this.departmentService.addOrUpdate(this.corporationId, this.departments, resolve, reject);
			});
			this.resetDepartments(departaments);
			this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
		} catch (error) {
			this.toastr.warning(messageCode['ERROR'][error]['summary']);
		}
	}
}
