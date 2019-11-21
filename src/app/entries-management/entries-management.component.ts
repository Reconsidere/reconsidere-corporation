import { Component, OnInit } from '@angular/core';
import * as messageCode from 'message.code.json';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/services/auth.service';
import { EntriesManagementService } from 'src/services/entries-management.service';
import { Entries, EntriesTypes } from 'src/models/entries';
import { ResiduesRegisterService } from 'src/services/residues-register.service';
import { Hierarchy, Material } from 'src/models/material';
import { SchedulingComponent } from '../scheduling/scheduling.component';
import { SchedulingService } from 'src/services/scheduling.service';
import { QrCode } from 'src/models/qrcode';

@Component({
	selector: 'app-entries-management',
	templateUrl: './entries-management.component.html',
	styleUrls: [ './entries-management.component.scss' ]
})
export class EntriesManagementComponent implements OnInit {
	page: number;
	corporationId: string;
	entries: any;
	entrieItems: any[];
	itemsMaterials: any[];
	types: any[];
	typeEntrie: any[];
	private readonly REGEX = /[^0-9.,]+/;

	private readonly NOTNUMBER = 'NaN';

	private readonly COMMA = ',';

	private readonly DOT = '.';

	constructor(
		private toastr: ToastrService,
		private authService: AuthService,
		private entriesService: EntriesManagementService,
		private schedulingService: SchedulingService
	) {}

	ngOnInit() {
		this.authService.isAuthenticated();
		this.page = 1;
		this.corporationId = this.authService.getCorporationId();
		this.loadValues();
		this.types = Object.values(EntriesTypes.Type);
		this.typeEntrie = Object.values(EntriesTypes.TypeEntrie);
	}

	loadValues() {
		this.entrieItems = [];
		this.itemsMaterials = [];
		this.entries = new Entries();
		this.loadMaterials();
		this.loadEntries();
	}

	async loadEntries() {
		var entries = undefined;
		try {
			entries = await new Promise((resolve, reject) => {
				entries = this.entriesService.allEntries(
					this.authService.getClass(),
					this.corporationId,
					resolve,
					reject
				);
			});

			if (entries) {
				this.createSimpleList(entries);
			} else {
				this.entries = new Entries();
			}
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	async loadMaterials() {
		var items = await new Promise((resolve, reject) => {
			this.schedulingService.allSchedulings(this.authService.getClass(), this.corporationId, resolve, reject);
		});
		if (items !== undefined) {
			this.insertMaterials(items);
			this.itemsMaterials.sort();
		}
	}

	insertMaterials(list: any) {
		list.forEach((value) => {
			if (value.qrCode !== null) {
				value.qrCode.forEach((item) => {
					if (this.itemsMaterials === undefined) {
						this.itemsMaterials = [
							{
								_idQrCode: item._id,
								collector: value.collector,
								_idColector: value.collector._id,
								_id: item.material._id,
								code: item.code,
								typeMaterial: EntriesTypes.TypeEntrie.Material,
								type: item.material.type,
								name: item.material.name,
								weight: item.material.weight,
								quantity: item.material.quantity,
								active: item.material.active,
								unity: item.material.unity
							}
						];
					} else {
						this.itemsMaterials.push({
							_idQrCode: item._id,
							collector: value.collector,
							_idColector: value.collector._id,
							_id: item.material._id,
							code: item.code,
							typeMaterial: EntriesTypes.TypeEntrie.Material,
							type: item.material.type,
							name: item.material.name,
							weight: item.material.weight,
							quantity: item.material.quantity,
							active: item.material.active,
							unity: item.material.unity
						});
					}
				});
			}
		});
	}

	createSimpleList(list: Entries) {
		this.insertItems(EntriesTypes.types.purchase, EntriesTypes.Type.Input, list);
		this.insertItems(EntriesTypes.types.sale, EntriesTypes.Type.Output, list);
	}

	insertItems(type: any, typeEntrie: any, list: Entries) {
		if (list[type] !== undefined && list[type].length > 0) {
			list[type].forEach((item) => {
				let obj = {
					_id: item._id,
					name: item.name,
					cost: item.cost,
					typeEntrie: item.typeEntrie,
					date: item.date,
					type: typeEntrie,
					isTypeMaterial: EntriesTypes.TypeEntrie.Material,
					amount: item.amount,
					weight: item.weight,
					quantity: item.quantity,
					qrCode: item.qrCode
				};

				this.setMaterial(obj);

				if (this.entrieItems === undefined || this.entrieItems.length <= 0) {
					this.entrieItems = [ obj ];
				} else {
					this.entrieItems.push(obj);
				}
			});
		}
	}

	setMaterial(item) {
		var value = this.itemsMaterials.find((x) => x.name === item.name);
		if (value) {
			item.qrCode.material = value;
			item['collector'] = value.collector;
		}
	}

	newItem() {
		var material = new Material();
		var qrCode = new QrCode();
		qrCode.material = material;
		let obj = {
			_id: undefined,
			type: undefined,
			isTypeMaterial: true,
			typeEntrie: undefined,
			cost: 0.0,
			name: undefined,
			date: new Date(),
			quantity: 1,
			weight: 0,
			amount: 0.0,
			qrCode: qrCode,
			collector: undefined,
			_idColector: undefined
		};
		if (this.entrieItems === undefined || this.entrieItems.length <= 0) {
			this.entrieItems = [ obj ];
		} else {
			this.entrieItems.push(obj);
		}
	}

	changedItem(item) {
		item['changed'] = true;
	}

	selectedMaterial(item) {
		if (item !== undefined) {
			item['changed'] = true;
			item.name = item.qrCode.material.name;
			item.cost = 0;
			item.weight = item.qrCode.material.weight;
			item.qrCode['_id'] = item.qrCode.material._idQrCode;
			item.qrCode['code'] = item.qrCode.material.code;
			item.collector = item.qrCode.material.collector;
			item._idColector = item.qrCode.material.collector._id;
		} else {
			item.name = '';
			item.cost = 0;
			item.weight = 0;
		}
	}

	changePrice(oldValue, value, item, e) {
		if (oldValue === value) {
			return;
		}
		item['changed'] = true;
		let number = value.replace(this.REGEX, '');
		number = Number(number.replace(this.COMMA, this.DOT)).toFixed(2);
		if (number === this.NOTNUMBER) {
			item.cost = '';
			return;
		}
		item.cost = Number(number);
		this.calculatePrice(item);
	}

	changeAmount(oldValue, value, item, e) {
		if (oldValue === value) {
			return;
		}
		item['changed'] = true;
		let number = value.replace(this.REGEX, '');
		number = Number(number.replace(this.COMMA, this.DOT)).toFixed(2);
		if (number === this.NOTNUMBER) {
			item.cost = '';
			return;
		}
		item.amount = Number(number);
		this.calculatePrice(item);
	}

	calculatePrice(item) {
		item['changed'] = true;
		if (
			(item.cost === undefined && item.quantity === undefined && item.weight === undefined) ||
			(item.quantity <= 0 && item.weight <= 0 && item.cost <= 0)
		) {
			this.toastr.warning(messageCode['WARNNING']['WRE013']['summary']);
			return;
		} else if (item.cost > 0 && item.quantity > 0 && item.weight > 0) {
			item.amount = item.cost * item.quantity * item.weight;
		} else if (item.cost > 0 && item.quantity > 0 && item.weight <= 0) {
			item.amount = item.cost * item.quantity;
		}
		item.date = new Date();
	}

	veryfyBeforeSave() {
		if (this.entrieItems === undefined || this.entrieItems.length <= 0) {
			this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
			throw new Error();
		}
		this.entrieItems.forEach((item) => {
			if (item.name === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (item.cost === undefined || item.cost <= 0) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (item.typeEntrie === undefined || item.typeEntrie === '') {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (item.type === undefined || item.type === '') {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (item.date === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (item.quantity === undefined || item.quantity <= 0) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (item.amount === undefined || item.amount <= 0) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (item.qrCode === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (item.qrCode.code === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (item.qrCode.material === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (
				item.qrCode.material.name === undefined ||
				item.qrCode.material.type === undefined ||
				item.qrCode.material.weight < 0 ||
				item.qrCode.material.quantity < 0 ||
				item.qrCode.material.unity === undefined
			) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
		});
	}

	removeInvalidaValuesToSave() {
		if (this.entries.sale) {
			if (this.entries.sale !== undefined && this.entries.sale.length > 0) {
				this.entries.sale.forEach((entries, index) => {
					delete entries.qrCode.material.collector;
					delete entries.collector;
					delete entries.qrCode.material.code;
					delete entries.qrCode.material._idQrCode;
					delete entries.qrCode.material.typeMaterial;
					delete entries.qrCode.material._idColector;
					delete entries.isTypeMaterial;
					delete entries.type;
					delete entries.changed;
				});
			}
		}
		if (this.entries.purchase) {
			if (this.entries.purchase !== undefined && this.entries.purchase.length > 0) {
				this.entries.purchase.forEach((entries, index) => {
					delete entries.qrCode.material.collector;
					delete entries.collector;
					delete entries.qrCode.material.code;
					delete entries.qrCode.material._idQrCode;
					delete entries.qrCode.material.typeMaterial;
					delete entries.isTypeMaterial;
					delete entries.type;
					delete entries.changed;
				});
			}
		}
	}

	removeNotChangedScheduling() {
		if (this.entries.sale !== undefined && this.entries.sale.length > 0) {
			this.entries.sale.forEach((sale, index) => {
				if (!sale.changed) {
					var sales = this.entries.sale;
					sales.splice(index, 1);
				}
			});
		}

		if (this.entries.purchase !== undefined && this.entries.purchase.length > 0) {
			this.entries.purchase.forEach((purchase, index) => {
				if (!purchase.changed) {
					var purchases = this.entries.purchase;
					purchases.splice(index, 1);
				}
			});
		}
	}

	async save() {
		try {
			this.veryfyBeforeSave();
			this.addToEntrie();
			this.removeNotChangedScheduling();
			this.removeInvalidaValuesToSave();
			if (
				this.entries.sale === undefined &&
				this.entries.sale.length <= 0 &&
				this.entries.purchase === undefined &&
				this.entries.purchase.length <= 0
			) {
				this.toastr.warning(messageCode['WARNNING']['WRE020']['summary']);
				this.entrieItems = [];
				this.itemsMaterials = [];
				this.entries = new Entries();
				this.loadMaterials();
				this.loadEntries();
				return;
			}
			var entries = await new Promise(async (resolve, reject) => {
				this.entriesService.addOrUpdate(
					this.authService.getClass(),
					this.corporationId,
					this.entries,
					resolve,
					reject
				);
			});
			this.resetEntries(entries);
			this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
		} catch (error) {
			this.toastr.warning(messageCode['ERROR'][error]['summary']);
		}
	}

	private addToEntrie() {
		this.entrieItems.forEach((entrieItems) => {
			if (entrieItems.type === EntriesTypes.Type.Input) {
				this.insertValues(entrieItems, EntriesTypes.types.purchase);
			}
			if (entrieItems.type === EntriesTypes.Type.Output) {
				this.insertValues(entrieItems, EntriesTypes.types.sale);
			}
		});
	}

	private insertValues(itemEntrie: any, type: string) {
		let isAdd = false;
		if (this.entries[type] !== undefined) {
			this.entries[type].forEach((item, index) => {
				if (item === itemEntrie) {
					this.entries[type][index] = itemEntrie;
					isAdd = true;
				} else if (item._id !== undefined && item._id === itemEntrie._id) {
					this.entries[type][index] = itemEntrie;
					isAdd = true;
				}
			});
			if (!isAdd) {
				this.entries[type].push(itemEntrie);
			}
		} else {
			this.entries[type] = [ itemEntrie ];
		}
	}

	async resetEntries(item) {
		this.entrieItems = [];
		this.itemsMaterials = [];
		this.entries = new Entries();
		await this.loadMaterials();
		this.createSimpleList(item);
	}
}
