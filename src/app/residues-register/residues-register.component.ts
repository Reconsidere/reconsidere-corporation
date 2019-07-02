import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ResiduesRegisterService } from 'src/services/residues-register.service';
import { AuthService } from 'src/services/auth.service';
import { Material } from 'src/models/material';
import * as messageCode from 'message.code.json';
import { ResiduesRegister } from 'src/models/residuesregister';
import { Department } from 'src/models/department';
import { QrCode } from 'src/models/qrcode';
import { DepartamentService } from 'src/services/departament.service';

@Component({
	selector: 'app-residues-register',
	templateUrl: './residues-register.component.html',
	styleUrls: [ './residues-register.component.scss' ]
})
export class ResiduesRegisterComponent implements OnInit {
	page: number;
	corporationId: string;
	residuesRegister: any;
	residuesRegisterOriginal: any;
	residuesRegisterName: any;
	materialsType: any;
	unitsType: any;
	nameResidue: any;
	nameDepartments: any;
	expand: boolean;
	constructor(
		private toastr: ToastrService,
		private residuesRegisterService: ResiduesRegisterService,
		private authService: AuthService,
		private departmentService: DepartamentService
	) {
		this.materialsType = Object.values(Material.Type);
		this.unitsType = Object.values(Material.Unit);
		this.residuesRegisterName = [];
		this.nameDepartments = [];
		this.expand = false;
	}

	ngOnInit() {
		this.authService.isAuthenticated();
		this.page = 1;
		this.corporationId = this.authService.getCorporationId();
		this.loadNameDepartments();
		this.loadResiduesRegister();
	}

	newItem() {
		var material = new Material();
		var qrCode = new QrCode();
		qrCode.code = this.uuidv4();
		material.active = true;
		material.name = this.nameResidue;
		material.quantity = 1;
		qrCode.material = material;
		if (this.residuesRegister === undefined) {
			this.residuesRegister = new ResiduesRegister();
			var departament = new Department();
			departament.qrCode = [ qrCode ];
			departament.active = true;

			this.residuesRegister.departments = [ departament ];
		} else {
			this.residuesRegister.departments.forEach((departament) => {
				if (departament.qrCode !== undefined && departament.qrCode.length > 0) {
					departament.qrCode.push(qrCode);
				} else {
					departament.qrCode = [ qrCode ];
				}
			});
		}
		if (!this.expand) {
			this.expand = true;
		}
	}

	async loadNameDepartments() {
		var departmentsName = undefined;
		try {
			departmentsName = await new Promise((resolve, reject) => {
				departmentsName = this.departmentService.allDepartamentsName(this.corporationId, resolve, reject);
			});

			if (departmentsName) {
				this.nameDepartments = departmentsName;
			}
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	async loadResiduesRegister() {
		var residuesRegister = undefined;
		try {
			residuesRegister = await new Promise((resolve, reject) => {
				residuesRegister = this.residuesRegisterService.allResiduesRegister(
					this.corporationId,
					resolve,
					reject
				);
			});

			if (residuesRegister) {
				this.residuesRegister = residuesRegister;
				this.residuesRegisterOriginal = JSON.parse(JSON.stringify(residuesRegister));
				this.residuesRegister.departments.forEach((departaments) => {
					this.nameDepartments.push(departaments.name);
					departaments.qrCode.material.forEach((material) => {
						this.residuesRegisterName.push(material.name);
					});
				});
			}
		} catch (error) {
			console.log(error);
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
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

	closeOrExpand() {
		if (this.expand) {
			this.expand = false;
		} else {
			this.expand = true;
		}
	}

	resetResidueRegisters(items) {}

	removeNonChangeds(): Boolean {
		var existchange = false;
		if (this.residuesRegisterOriginal === undefined || this.residuesRegisterOriginal === undefined) {
			return true;
		}
		if (this.residuesRegister.departaments.length > this.residuesRegisterOriginal.departaments.length) {
			existchange = true;
		}
		var changed = false;
		this.residuesRegister.departaments.forEach((department, index) => {
			changed = false;
			this.residuesRegisterOriginal.departament.forEach((original) => {
				if (department._id !== undefined) {
					if (department._id === original._id) {
						if (department.name !== original.name) {
							existchange = true;
							changed = true;
						} else {
						}

						department.qrCode.forEach((qrCode) => {
							original.qrCode.forEach((qrCodeOriginal) => {
								if (qrCode.code !== qrCodeOriginal) {
									existchange = true;
									changed = true;
								} else {
								}
								if (qrCode.material._id === undefined) {
									existchange = true;
									changed = true;
								} else if (qrCode.material._id === qrCodeOriginal.material._id) {
									if (
										qrCode.material.name !== qrCodeOriginal.name ||
										qrCode.material.type !== qrCodeOriginal.type ||
										qrCode.material.weight !== qrCodeOriginal.weight ||
										qrCode.material.quantity !== qrCodeOriginal.quantity ||
										qrCode.material.unity !== qrCodeOriginal.unity ||
										qrCode.material.active !== qrCodeOriginal.active
									) {
										existchange = true;
										changed = true;
									} else {
									}
								}
							});
						});
					}
				} else {
					existchange = true;
				}
			});
			if (!changed) {
				this.residuesRegisterOriginal.splice(index, 1);
			}
		});
		return existchange;
	}

	veryfyBeforeSave() {
		if (this.residuesRegister.departments === undefined || this.residuesRegister.departments.length <= 0) {
			this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
			throw new Error();
		}
		this.residuesRegister.departments.departments.forEach((department) => {
			if (department.name === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			department.qrCode.forEach((qrCode) => {
				if (qrCode.code === undefined) {
					this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
					throw new Error();
				}
				if (qrCode.material === undefined) {
				}
				if (
					qrCode.material.name === undefined ||
					qrCode.material.type === undefined ||
					qrCode.material.weight < 0 ||
					qrCode.material.quantity < 0 ||
					qrCode.material.unity === undefined
				) {
					this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
					throw new Error();
				}
			});
		});
	}

	async save() {
		try {
			if (!this.removeNonChangeds()) {
				this.loadNameDepartments();
				this.loadResiduesRegister();
				this.toastr.warning(messageCode['WARNNING']['WRE020']['summary']);
				return;
			}
			this.veryfyBeforeSave();
			var registerResidues = await new Promise(async (resolve, reject) => {
				this.residuesRegister.addOrUpdate(this.corporationId, this.residuesRegister, resolve, reject);
			});
			this.resetResidueRegisters(registerResidues);
			this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
		} catch (error) {
			this.toastr.warning(messageCode['ERROR'][error]['summary']);
		}
	}
}
