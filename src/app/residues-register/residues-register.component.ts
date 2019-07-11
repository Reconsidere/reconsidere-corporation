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
	departments: any;
	expand: boolean;
	residuesToSave: ResiduesRegister;
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
		this.residuesToSave = new ResiduesRegister();
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
		material.active = true;
		material.name = this.nameResidue;
		material.quantity = 1;
		qrCode.material = material;
		var newDepartment = new Department();
		newDepartment.isChanged = true;
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
				departments = this.departmentService.allDepartaments(this.corporationId, resolve, reject);
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
			this.residuesRegisterOriginal = JSON.parse(JSON.stringify(residuesRegister));
			this.residuesRegister.departments.forEach((departments) => {
				departments.qrCode.forEach((qrcode) => {
					this.residuesRegisterName.push(qrcode.material.name);
				});
			});
		}
	}

	selectDepartment(oldID, objectCurrent, indexQrCodetoChange) {
		if (!oldID) {
			var item = this.departments.find((x) => x._id === objectCurrent._id);
			objectCurrent.name = item.name;
			objectCurrent.description = item.description;
			objectCurrent.active = item.active;
			objectCurrent._id = item._id;
		} else {
			if (this.residuesRegister.departments.length === 1) {
				objectCurrent.isChanged = true;
				var isReturn = false;
				this.residuesRegister.departments.forEach((department) => {
					if (department.qrCode.length === 1) {
						isReturn = true;
					}
				});
				if (isReturn) {
					return;
				}
			}
			var idNewDepartment = objectCurrent._id;
			objectCurrent._id = oldID;
			objectCurrent.isChanged = true;
			//add qrCode to new
			var isAdd = false;
			this.residuesRegister.departments.forEach((department) => {
				if (department._id === idNewDepartment && !isAdd) {
					var element = objectCurrent.qrCode[indexQrCodetoChange];
					department.qrCode.push(element);
					isAdd = true;
				}
			});
			if (!isAdd) {
				var item = this.departments.find((x) => x._id === idNewDepartment);
				this.newItem();
				this.residuesRegister.departments[this.residuesRegister.departments.length - 1].name = item.name;
				this.residuesRegister.departments[this.residuesRegister.departments.length - 1].description =
					item.description;
				this.residuesRegister.departments[this.residuesRegister.departments.length - 1].active = item.active;
				this.residuesRegister.departments[this.residuesRegister.departments.length - 1]._id = item._id;
				this.residuesRegister.departments[this.residuesRegister.departments.length - 1].qrCode[0] =
					objectCurrent.qrCode[indexQrCodetoChange];
			}

			//remover o qrCode do antigo
			var isRemoved = false;
			this.residuesRegister.departments.forEach((department) => {
				if (department._id === oldID && !isRemoved) {
					department.qrCode.splice(indexQrCodetoChange, 1);
					isRemoved = true;
				}
			});
		}
		// var item = this.departments.find((x) => x._id === object._id);
		// if (item) {
		// 	if (old !== undefined || old !== null) {
		// 		if (item._id !== old) {
		// 			object.isChanged = true;
		// 			var objectToAddAndRemove = object.qrCode[index];
		// 			var added = false;
		// 			var removed = false;
		// 			object.qrCode.forEach((qrCode) => {
		// 				this.residuesRegister.departments.forEach((department, i) => {
		// 					if (department._id === item._id) {
		// 						if (!added) {
		// 							if (department.qrCode === undefined || department.qrCode.length <= 0) {
		// 								department.qrCode = [ objectToAddAndRemove ];
		// 								added = true;
		// 							} else {
		// 								department.qrCode.push(objectToAddAndRemove);
		// 								added = true;
		// 							}
		// 						}
		// 					}
		// 					if (department._id === old) {
		// 						if (!removed) {
		// 							object.qrCode.splite(i, 1);
		// 							removed = true;
		// 						}
		// 					}
		// 				});
		// 			});
		// 		}
		// 	} else {
		// 		object.name = item.name;
		// 		object.description = item.description;
		// 		object.active = item.active;
		// 		object._id = item._id;
		// 	}
		// } else {
		// 	object.name = undefined;
		// 	object.description = undefined;
		// 	object.active = undefined;
		// 	object._id = undefined;
		// }
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
		this.residuesToSave = new ResiduesRegister();
		this.insertValues(residuesRegister);
	}

	removeNonChangeds(): Boolean {
		var existchange = false;
		if (this.residuesRegisterOriginal === undefined || this.residuesRegisterOriginal === undefined) {
			this.residuesToSave = JSON.parse(JSON.stringify(this.residuesRegister));
			return true;
		}
		if (this.residuesRegister.departments.length > this.residuesRegisterOriginal.departments.length) {
			existchange = true;
		}

		var changed;
		var match;
		this.residuesRegister.departments.forEach((department) => {
			changed = false;
			match = false;
			this.residuesRegisterOriginal.departments.forEach((original) => {
				if (department._id === original._id) {
					match = true;
					if (
						department.name !== original.name ||
						department.description !== original.description ||
						department.active !== original.active
					) {
						existchange = true;
						changed = true;
					}

					department.qrCode.forEach((qrCode) => {
						original.qrCode.forEach((qrCodeOriginal) => {
							if (qrCode.material._id === undefined) {
								existchange = true;
								changed = true;
							} else if (qrCode.material._id === qrCodeOriginal.material._id) {
								if (
									qrCode.material.name !== qrCodeOriginal.material.name ||
									qrCode.material.type !== qrCodeOriginal.material.type ||
									qrCode.material.weight !== qrCodeOriginal.material.weight ||
									qrCode.material.quantity !== qrCodeOriginal.material.quantity ||
									qrCode.material.unity !== qrCodeOriginal.material.unity ||
									qrCode.material.active !== qrCodeOriginal.material.active
								) {
									existchange = true;
									changed = true;
								}
							}
						});
					});
				}
				if (department.isChanged) {
					existchange = true;
					changed = true;
				}
			});
			if (changed) {
				if (!this.residuesToSave.departments) {
					this.residuesToSave.departments = [ department ];
				} else {
					this.residuesToSave.departments.push(department);
				}
				changed = false;
			} else if (!match) {
				if (!this.residuesToSave.departments) {
					this.residuesToSave.departments = [ department ];
				} else {
					this.residuesToSave.departments.push(department);
				}
			}
		});
		return existchange;
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
				this.loadDepartments();
				this.loadResiduesRegister();
				this.toastr.warning(messageCode['WARNNING']['WRE020']['summary']);
				return;
			}
			this.veryfyBeforeSave();
			var registerResidues = await new Promise(async (resolve, reject) => {
				this.residuesRegisterService.addOrUpdate(this.corporationId, this.residuesToSave, resolve, reject);
			});
			this.resetResidueRegisters(registerResidues);
			this.loadDepartments();
			this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
		} catch (error) {
			this.toastr.warning(messageCode['ERROR'][error]['summary']);
		}
	}
}
