import { Component, OnInit } from '@angular/core';
import * as messageCode from 'message.code.json';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/services/auth.service';
import { DepartamentService } from 'src/services/departament.service';
import { ResiduesRegisterService } from 'src/services/residues-register.service';
import { EntriesManagementService } from 'src/services/entries-management.service';
import { SchedulingService } from 'src/services/scheduling.service';
import { EntriesTypes, Entries } from 'src/models/entries';
import { ResidueArrived } from 'src/models/residuearrived';
import { Corporation } from 'src/models/corporation';
import { ProviderRegistration } from 'src/models/providerregistration';
import { environment } from 'src/environments/environment';
import { CollectorService } from 'src/services/collector.service';

@Component({
	selector: 'app-residue-arrived',
	templateUrl: './residue-arrived.component.html',
	styleUrls: [ './residue-arrived.component.scss' ]
})
export class ResidueArrivedComponent implements OnInit {
	page: number;
	corporationId: string;
	expand: any;
	expandClient: any;
	entries: any;
	entriesClients: any;
	entrieItems: any[];
	entrieItemsClients: any[];
	entrieItemsCollectionsClients: any[];
	itemsMaterials: any[];
	itemsMaterialsCollectionsClients: any[];
	residuesConfirmed: any;
	typeCollector;
	collectionClients;

	private readonly REGEX = /[^0-9.,]+/;

	private readonly NOTNUMBER = 'NaN';

	private readonly COMMA = ',';

	private readonly DOT = '.';

	constructor(
		private toastr: ToastrService,
		private authService: AuthService,
		private entriesService: EntriesManagementService,
		private schedulingService: SchedulingService,
		private collectorService: CollectorService
	) {
		this.residuesConfirmed = Object.values(ResidueArrived.Confirmed);
	}

	ngOnInit() {
		this.authService.isAuthenticated();
		this.page = 1;
		this.corporationId = this.authService.getCorporationId();
		this.loadValues();
	}

	async loadValues() {
		this.entrieItems = [];
		this.entrieItemsClients = [];
		this.itemsMaterials = [];
		this.itemsMaterialsCollectionsClients = [];
		await this.typeCorporations();
		await this.loadMaterials();
		await this.loadEntries();

		if (this.typeCollector) {
			await this.loadMyCollectionsClients();
			await this.loadMaterialsCollectionsClients();
			await this.loadEntriesCollectionsClients();
		}
	}

	typeCorporations() {
		if (this.authService.getClass() === Corporation.Classification.Coletora) {
			this.typeCollector = true;
		} else if (this.authService.getClass() === ProviderRegistration.Classification.Provider) {
			this.typeCollector = false;
		} else {
			this.typeCollector = false;
		}
	}

	//#region my clients residues to arrived

	async loadMyCollectionsClients() {
		var collectionClients;
		collectionClients = await new Promise((resolve, reject) => {
			collectionClients = this.collectorService.allClientsToCollector(
				this.authService.getClass(),
				this.corporationId,
				resolve,
				reject
			);
		});
		if (collectionClients) {
			this.collectionClients = collectionClients;
		}
	}

	async loadMaterialsCollectionsClients() {
		await this.collectionClients.forEach(async (client) => {
			var items = await new Promise((resolve, reject) => {
				this.schedulingService.allSchedulings(client.classification, client._id, resolve, reject);
			});
			if (items !== undefined) {
				this.insertMaterialsCollectionsClients(items, client._id);
				this.itemsMaterialsCollectionsClients.sort();
			}
		});
	}

	async loadEntriesCollectionsClients() {
		var entriesClients = undefined;
		try {
			this.collectionClients.forEach(async (client) => {
				entriesClients = await new Promise((resolve, reject) => {
					entriesClients = this.entriesService.allEntries(client.classification, client._id, resolve, reject);
				});

				if (entriesClients) {
					this.createSimpleListCollectionsClients(entriesClients);
				}
			});
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	createSimpleListCollectionsClients(list: Entries) {
		this.insertItemsCollectionsClients(EntriesTypes.types.purchase, EntriesTypes.Type.Input, list);
		this.insertItemsCollectionsClients(EntriesTypes.types.sale, EntriesTypes.Type.Output, list);
	}

	insertItemsCollectionsClients(type: any, typeEntrie: any, list: Entries) {
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
					qrCode: item.qrCode,
					confirmedByCorporation: String,
					confirmedByCollector: String
				};

				this.setMaterialCollectionsClients(obj);

				if (this.entrieItemsClients === undefined || this.entrieItemsClients.length <= 0) {
					this.entrieItemsClients = [ obj ];
				} else {
					this.entrieItemsClients.push(obj);
				}
			});
		}
	}

	setMaterialCollectionsClients(item) {
		var value = this.itemsMaterialsCollectionsClients.find((x) => x.name === item.name);
		if (value) {
			item.qrCode.material = value;
			item['collector'] = value.collector;
		}
	}

	insertMaterialsCollectionsClients(list: any, _idClient) {
		list.forEach((value) => {
			if (value.qrCode !== null) {
				value.qrCode.forEach((item) => {
					if (this.itemsMaterialsCollectionsClients === undefined) {
						this.itemsMaterialsCollectionsClients = [
							{
								_idQrCode: item._id,
								collector: value.collector,
								_id: item.material._id,
								_idCleint: _idClient,
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
						this.itemsMaterialsCollectionsClients.push({
							_idQrCode: item._id,
							collector: value.collector,
							_id: item.material._id,
							_idCleint: _idClient,
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

	removeInvalidaValuesToSaveClient() {
		if (this.entriesClients.sale) {
			if (this.entriesClients.sale !== undefined && this.entriesClients.sale.length > 0) {
				this.entriesClients.sale.forEach((entries, index) => {
					delete entries.qrCode.material.collector;
					delete entries.collector;
					delete entries._idCleint;
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
		if (this.entriesClients.purchase) {
			if (this.entriesClients.purchase !== undefined && this.entriesClients.purchase.length > 0) {
				this.entriesClients.purchase.forEach((entries, index) => {
					delete entries.qrCode.material.collector;
					delete entries.collector;
					delete entries._idCleint;
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

	removeNotChangedSchedulingClient() {
		if (this.entriesClients.sale !== undefined && this.entriesClients.sale.length > 0) {
			this.entriesClients.sale.forEach((sale, index) => {
				if (!sale.changed) {
					var sales = this.entries.sale;
					sales.splice(index, 1);
				}
			});
		}

		if (this.entriesClients.purchase !== undefined && this.entriesClients.purchase.length > 0) {
			this.entriesClients.purchase.forEach((purchase, index) => {
				if (!purchase.changed) {
					var purchases = this.entries.purchase;
					purchases.splice(index, 1);
				}
			});
		}
	}

	veryfyBeforeSaveClient() {
		if (this.entrieItemsClients === undefined || this.entrieItemsClients.length <= 0) {
			this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
			throw new Error();
		}
		this.entrieItemsClients.forEach((item) => {
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
			if (item.confirmedByCollector === undefined) {
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

	private addToEntrieclients() {
		this.entrieItemsClients.forEach((entrieItems) => {
			if (entrieItems.type === EntriesTypes.Type.Input) {
				this.insertValuesClients(entrieItems, EntriesTypes.types.purchase);
			}
			if (entrieItems.type === EntriesTypes.Type.Output) {
				this.insertValuesClients(entrieItems, EntriesTypes.types.sale);
			}
		});
	}

	private insertValuesClients(itemEntrie: any, type: string) {
		let isAdd = false;
		if (this.entriesClients !== undefined) {
			this.entriesClients.forEach((item, index) => {
				if (item === itemEntrie) {
					this.entriesClients[index] = itemEntrie;
					isAdd = true;
				} else if (item._id !== undefined && item._id === itemEntrie._id) {
					this.entriesClients[index] = itemEntrie;
					isAdd = true;
				}
			});
			if (!isAdd) {
				this.entriesClients.push(itemEntrie);
			}
		} else {
			this.entriesClients = [ itemEntrie ];
		}
	}

	async resetEntriesClients(item) {
		this.entrieItemsClients = [];
		this.itemsMaterialsCollectionsClients = [];
		this.entriesClients = new Entries();
		await this.loadMaterialsCollectionsClients();
		this.createSimpleListCollectionsClients(item);
	}

	//#endregion

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
					qrCode: item.qrCode,
					confirmedByCorporation: String,
					confirmedByCollector: String
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
			if (item.confirmedByCorporation === undefined) {
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

	expands() {
		if (this.expand) {
			this.expand = false;
		} else {
			this.expand = true;
		}
	}

	expandClients() {
		if (this.expandClient) {
			this.expandClient = false;
		} else {
			this.expandClient = true;
		}
	}

	changedItem(item) {
		item['changed'] = true;
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

	async save() {}

	async saveClients() {
		try {
			this.veryfyBeforeSaveClient();
			this.addToEntrieclients();
			this.removeNotChangedSchedulingClient();
			this.removeInvalidaValuesToSaveClient();
			if (
				this.entriesClients.sale === undefined &&
				this.entriesClients.sale.length <= 0 &&
				this.entriesClients.purchase === undefined &&
				this.entriesClients.purchase.length <= 0
			) {
				this.toastr.warning(messageCode['WARNNING']['WRE020']['summary']);
				this.entrieItemsClients = [];
				this.itemsMaterialsCollectionsClients = [];
				this.entriesClients = new Entries();
				this.loadMaterialsCollectionsClients();
				this.loadEntriesCollectionsClients();
				return;
			}
			var entries = await new Promise(async (resolve, reject) => {
				// this.entriesService.addOrUpdate(
				// 	this.authService.getClass(),
				// 	this.corporationId,
				// 	this.entriesClients,
				// 	resolve,
				// 	reject
				// );
			});
			this.resetEntriesClients(entries);
			this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
		} catch (error) {
			this.toastr.warning(messageCode['ERROR'][error]['summary']);
		}
	}
}
