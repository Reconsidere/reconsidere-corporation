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
	residuesRegisterName: any;
	materialsType: any;
	unitsType: any;
	nameResidue: any;
	departments: any;
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
		this.departments = [];
		this.expand = false;
	}

	ngOnInit() {
		this.authService.isAuthenticated();
		this.page = 1;
		this.corporationId = this.authService.getCorporationId();
		this.loadDepartments();
		this.loadResiduesRegister();
	}

	newItem() {
		var material = new Material();
		var qrCode = new QrCode();
		qrCode.code = this.uuidv4();
		qrCode.date = new Date();
		material.active = true;
		material.name = this.nameResidue;
		material.quantity = 1;
		qrCode.material = material;
		var newDepartment = new Department();
		newDepartment.active = true;
		if (this.residuesRegister === undefined) {
			this.residuesRegister = new ResiduesRegister();
			this.residuesRegister.departments = [];
			newDepartment.qrCode = [ qrCode ];
			this.residuesRegister.departments.push(newDepartment);
		} else {
			newDepartment.qrCode = [ qrCode ];
			this.residuesRegister.departments.push(newDepartment);
		}
		if (!this.expand) {
			this.expand = true;
		}
	}

	async loadDepartments() {
		var departments = undefined;
		this.departments = undefined;
		try {
			departments = await new Promise((resolve, reject) => {
				departments = this.departmentService.allDepartaments(
					this.authService.getClass(),
					this.corporationId,
					resolve,
					reject
				);
			});

			if (departments) {
				this.departments = departments;
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
					this.authService.getClass(),
					this.corporationId,
					resolve,
					reject
				);
			});
			this.insertValues(residuesRegister);
		} catch (error) {
			console.log(error);
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	private insertValues(residuesRegister: any) {
		this.residuesRegisterName = [];
		if (
			residuesRegister !== null &&
			residuesRegister.departments !== undefined &&
			residuesRegister.departments.length > 0
		) {
			this.residuesRegister = JSON.parse(JSON.stringify(residuesRegister));
			this.residuesRegister.departments.forEach((departments) => {
				departments.qrCode.forEach((qrcode) => {
					this.residuesRegisterName.push(qrcode.material.name);
				});
			});
		}
	}

	selectDepartment(oldItem, newID, indexQrCodetoChange) {
		var objectCurrent = this.residuesRegister.departments.find((x) => x._id === newID);
		if (!oldItem) {
			var item = this.departments.find((x) => x._id === objectCurrent._id);
			objectCurrent.name = item.name;
			objectCurrent.description = item.description;
			objectCurrent.active = item.active;
			objectCurrent._id = item._id;
		} else if (objectCurrent && objectCurrent._id) {
			var idNewDepartment = objectCurrent._id;
			var item = this.departments.find((x) => x._id === idNewDepartment);

			var isNew;
			if (item && oldItem.qrCode) {
				var element = this.residuesRegister.departments.find((x) => x._id === item._id);
				element.qrCode.push(oldItem.qrCode[indexQrCodetoChange]);
			} else {
				this.newItem();
				var index = this.residuesRegister.departments.length - 1;
				this.residuesRegister.departments[index].name = item.name;
				this.residuesRegister.departments[index].description = item.description;
				this.residuesRegister.departments[index].active = item.active;
				this.residuesRegister.departments[index]._id = item._id;
				this.residuesRegister.departments[index].qrCode[0] = objectCurrent.qrCode[indexQrCodetoChange];
				isNew = true;
			}

			var removed;
			this.residuesRegister.departments.forEach((department, ind) => {
				if (!removed) {
					if (!isNew) {
						if (oldItem._id == department._id) {
							department.qrCode.forEach((qrCode, index) => {
								if (!removed) {
									if (qrCode._id === oldItem.qrCode[indexQrCodetoChange]._id) {
										department.qrCode.splice(index, 1);
										removed = true;
									}
								}
							});
						}
					} else {
						if (objectCurrent._id == department._id) {
							department.qrCode.forEach((qrCode, index) => {
								if (!removed) {
									if (qrCode._id === objectCurrent.qrCode[indexQrCodetoChange]._id) {
										department.qrCode.splice(index, 1);
										removed = true;
									}
								}
							});
						}
					}
				}
			});

			var isEmptyQrCode = this.residuesRegister.departments.find((x) => x._id === oldItem._id);

			if (!isEmptyQrCode.qrCode || isEmptyQrCode.qrCode.length <= 0) {
				var isRemovedOld;
				this.residuesRegister.departments.forEach((department, index) => {
					if (!isRemovedOld) {
						if (department._id === oldItem._id) {
							this.residuesRegister.departments.splice(index, 1);
							isRemovedOld = true;
						}
					}
				});
			}
		} else {
			this.newItem();
			var isNew;
			var index = this.residuesRegister.departments.length - 1;
			var item = this.departments.find((x) => x._id === newID);
			this.residuesRegister.departments[index].name = item.name;
			this.residuesRegister.departments[index].description = item.description;
			this.residuesRegister.departments[index].active = item.active;
			this.residuesRegister.departments[index]._id = item._id;
			this.residuesRegister.departments[index].qrCode[0] = oldItem.qrCode[indexQrCodetoChange];

			var removed;
			this.residuesRegister.departments.forEach((department, ind) => {
				if (!removed) {
					if (oldItem._id == department._id) {
						department.qrCode.forEach((qrCode, index) => {
							if (!removed) {
								if (qrCode._id === oldItem.qrCode[indexQrCodetoChange]._id) {
									department.qrCode.splice(index, 1);
									removed = true;
								}
							}
						});
					}
				}
			});

			var isEmptyQrCode = this.residuesRegister.departments.find((x) => x._id === oldItem._id);

			if (!isEmptyQrCode.qrCode || isEmptyQrCode.qrCode.length <= 0) {
				var isRemovedOld;
				this.residuesRegister.departments.forEach((department, index) => {
					if (!isRemovedOld) {
						if (department._id === oldItem._id) {
							this.residuesRegister.departments.splice(index, 1);
							isRemovedOld = true;
						}
					}
				});
			}
		}
		var refresh = JSON.parse(JSON.stringify(this.residuesRegister));
		this.residuesRegister = undefined;
		this.residuesRegister = refresh;
	}

	/**
	 * Utilizado por hora para gerar ids unicos para cada produto no lugar do Qr code
	 */
	uuidv4() {
		return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (Math.random() * 16) | 0,
				v = c == 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	closeOrExpand() {
		if (this.residuesRegister === undefined || this.residuesRegister === null) {
			return;
		}
		if (this.expand) {
			this.expand = false;
		} else {
			this.expand = true;
		}
	}

	resetResidueRegisters(residuesRegister) {
		this.insertValues(residuesRegister);
	}

	ChangedItem(item) {
		item.changed = true;
	}

	ChangedQrItem(itemQrCode) {
		this.residuesRegister.departments.forEach((department, index) => {
			department.qrCode.forEach((qrCode) => {
				if (qrCode.code === itemQrCode.code) {
					department.changed = true;
				}
			});
		});
	}

	removeNotChanged() {
		this.residuesRegister.departments.forEach((department, index) => {
			if (!department.changed) {
				this.residuesRegister.departments.splice(index, 1);
			}
		});
	}

	veryfyBeforeSave() {
		if (this.residuesRegister.departments === undefined || this.residuesRegister.departments.length <= 0) {
			this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
			throw new Error();
		}
		this.residuesRegister.departments.forEach((department) => {
			if (department.name === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			department.qrCode.forEach((qrCode) => {
				if (qrCode.code === undefined || qrCode.date === undefined) {
					this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
					throw new Error();
				}
				if (qrCode.material === undefined) {
					this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
					throw new Error();
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

	changeDate() {
		this.residuesRegister.departments.forEach((department) => {
			department.qrCode.forEach((qrCode) => {
				qrCode.date = new Date();
			});
		});
	}

	removeInvalidaValuesToSave() {
		this.residuesRegister.departments.forEach((department, index) => {
			delete department.changed;
		});
	}

	async save() {
		try {
			this.removeNotChanged();
			this.removeInvalidaValuesToSave();

			if (this.residuesRegister.departments.length <= 0) {
				this.loadDepartments();
				this.loadResiduesRegister();
				this.toastr.warning(messageCode['WARNNING']['WRE020']['summary']);
				return;
			}
			this.changeDate();
			this.veryfyBeforeSave();
			var registerResidues = await new Promise(async (resolve, reject) => {
				this.residuesRegisterService.addOrUpdate(
					this.authService.getClass(),
					this.corporationId,
					this.residuesRegister,
					resolve,
					reject
				);
			});
			this.resetResidueRegisters(registerResidues);
			this.loadDepartments();
			this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
		} catch (error) {
			this.toastr.warning(messageCode['ERROR'][error]['summary']);
		}
	}
}
