import { Component, OnInit } from '@angular/core';
import { SchedulingService } from 'src/services/scheduling.service';
import { AuthService } from 'src/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as messageCode from 'message.code.json';
import { Scheduling } from 'src/models/scheduling';
import { CollectorService } from 'src/services/collector.service';
import { QrCode } from 'src/models/qrcode';
import { ResiduesRegisterService } from 'src/services/residues-register.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
	selector: 'app-scheduling',
	templateUrl: './scheduling.component.html',
	styleUrls: [ './scheduling.component.scss' ]
})
export class SchedulingComponent implements OnInit {
	page: number;
	corporationId: string;
	schedulings: any;
	schedulingsOriginal: any;
	collectors: any;
	qrCodeList: any;

	constructor(
		private toastr: ToastrService,
		private schedulingstService: SchedulingService,
		private collectorService: CollectorService,
		private residuesRegisterService: ResiduesRegisterService,
		private authService: AuthService
	) {
		this.schedulings = [];
		this.schedulingsOriginal = [];
		this.collectors = [];
		this.qrCodeList = [];
	}

	ngOnInit() {
		this.authService.isAuthenticated();
		this.page = 1;
		this.corporationId = this.authService.getCorporationId();
		this.loadCollectors();
		this.loadSchedulings();
		this.loadResiduesRegister();
	}

	async loadCollectors() {
		var collectors = undefined;
		this.collectors = undefined;
		try {
			collectors = await new Promise((resolve, reject) => {
				collectors = this.collectorService.allCollectors(
					this.authService.getClass(),
					this.corporationId,
					resolve,
					reject
				);
			});

			if (collectors) {
				this.collectors = collectors;
			}
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	async loadResiduesRegister() {
		var qrCodeList = undefined;
		this.qrCodeList = undefined;
		try {
			qrCodeList = await new Promise((resolve, reject) => {
				qrCodeList = this.residuesRegisterService.allResiduesRegister(
					this.authService.getClass(),
					this.corporationId,
					resolve,
					reject
				);
			});

			if (qrCodeList) {
				qrCodeList.departments.forEach((department) => {
					department.qrCode.forEach((qrCode) => {
						var exist = false;
						for (var i = 0; this.schedulings.length > i; i++) {
							exist = this.schedulings[i].qrCode.find((x) => x._id === qrCode._id);
							if (exist) {
								break;
							}
						}
						if (!exist) {
							if (this.qrCodeList === undefined || this.qrCodeList.length <= 0) {
								this.qrCodeList = [ qrCode ];
							} else {
								this.qrCodeList.push(qrCode);
							}
						}
					});
				});
			}
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	async loadSchedulings() {
		var schedulings = undefined;
		try {
			schedulings = await new Promise((resolve, reject) => {
				schedulings = this.schedulingstService.allSchedulings(
					this.authService.getClass(),
					this.corporationId,
					resolve,
					reject
				);
			});

			if (schedulings) {
				for (var i = 0; schedulings.length > i; i++) {
					if (
						schedulings[i].qrCode === null ||
						schedulings[i].qrCode === undefined ||
						schedulings[i].qrCode.length <= 0
					) {
						return;
					}
				}
				this.schedulings = schedulings;
				this.schedulings.forEach((scheduling) => {
					scheduling['expand'] = false;
				});
				this.schedulingsOriginal = JSON.parse(JSON.stringify(schedulings));
			}
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	selectCollector(objectCurrent, indexCollectortoChange) {
		var item = this.collectors.find((x) => x._id === objectCurrent._id);
		objectCurrent.company = item.company;
		objectCurrent.cnpj = item.cnpj;
		objectCurrent.active = item.active;
		objectCurrent.tradingName = item.tradingName;
		objectCurrent.phone = item.phone;
		objectCurrent.cellPhone = item.cellPhone;
		objectCurrent.class = item.class;
		objectCurrent.email = item.email;
		objectCurrent._id = item._id;
		objectCurrent.classification = item.classification;
	}

	resetScheduling(items) {
		this.schedulings = items;
		this.schedulings.forEach((scheduling) => {
			scheduling['expand'] = false;
		});
		this.schedulingsOriginal = JSON.parse(JSON.stringify(items));
	}

	remove(scheduling) {
		this.schedulings.forEach((item, index) => {
			if (item === scheduling) {
				item.active = false;
				return;
			}
		});
	}

	newItem() {
		var scheduling = {
			active: true,
			collector: new Scheduling.Collector(),
			expand: false,
			qrCode: [],
			changed: true
		};
		scheduling.qrCode = [];
		this.schedulings.push(scheduling);
	}

	expandMaterial(item) {
		if (item.expand) {
			item.expand = false;
		} else {
			item.expand = true;
		}
	}

	drop(event: CdkDragDrop<[]>, item) {
		try {
			if (event.previousContainer === event.container) {
				moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
			} else {
				transferArrayItem(
					event.previousContainer.data,
					event.container.data,
					event.previousIndex,
					event.currentIndex
				);
			}
			item.changed = true;
		} catch (error) {
			console.log(error);
		}
	}

	ChangedItem(item) {
		item.changed = true;
	  }

	  ChangeDate(event, item) {
		item.date = event;
		item.changed = true;
	  }

	  ChangeNumber(event, item) {
		item.hour = event;
		item.changed = true;
	  }



	veryfyBeforeSave() {
		if (this.schedulings === undefined || this.schedulings.length <= 0) {
			this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
			throw new Error();
		}
		this.schedulings.forEach((scheduling) => {
			if (scheduling.hour === undefined || scheduling.date === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (scheduling.collector === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (
				scheduling.collector._id === undefined ||
				scheduling.collector.company === undefined ||
				scheduling.collector.cnpj === undefined ||
				scheduling.collector.tradingName === undefined ||
				scheduling.collector.phone === undefined ||
				scheduling.collector.cellPhone === undefined ||
				scheduling.collector.email === undefined ||
				scheduling.collector.classification === undefined
			) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (scheduling.qrCode === undefined || scheduling.qrCode.length <= 0) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			scheduling.qrCode.forEach((qrCode) => {
				if (
					qrCode._id === undefined ||
					qrCode.code === undefined ||
					qrCode.material._id === undefined ||
					qrCode.material.type === undefined ||
					qrCode.material.name === undefined ||
					qrCode.material.weight === undefined ||
					qrCode.material.quantity === undefined ||
					qrCode.material.unity === undefined ||
					qrCode.material.active === undefined
				) {
					this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
					throw new Error();
				}
			});
		});
	}

	removeInvalidaValuesToSave() {
		this.schedulings.forEach((scheduling, index) => {
			delete scheduling.expand;
			delete scheduling.changed;
		});
	}

	removeNotChangedScheduling() {
		this.schedulings.forEach((scheduling, index) => {
			if (!scheduling.changed) {
				this.schedulings.splice(index, 1);
			}
		});
	}

	async save() {
		try {
			this.removeNotChangedScheduling();
			this.removeInvalidaValuesToSave();
			this.veryfyBeforeSave();
			if (this.schedulings.length <= 0) {
				this.toastr.warning(messageCode['WARNNING']['WRE020']['summary']);
				return;
			}

			var schedulings = await new Promise(async (resolve, reject) => {
				this.schedulingstService.addOrUpdate(
					this.authService.getClass(),
					this.corporationId,
					this.schedulings,
					resolve,
					reject
				);
			});
			this.resetScheduling(schedulings);
			this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
		} catch (error) {
			this.toastr.warning(messageCode['ERROR'][error]['summary']);
		}
	}
}
