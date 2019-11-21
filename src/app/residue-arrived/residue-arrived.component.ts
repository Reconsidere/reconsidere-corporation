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
				this.insertMaterialsCollectionsClients(items);
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

	insertMaterialsCollectionsClients(list: any) {
		list.forEach((value) => {
			if (value.qrCode !== null) {
				value.qrCode.forEach((item) => {
					if (this.itemsMaterialsCollectionsClients === undefined) {
						this.itemsMaterialsCollectionsClients = [
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
						this.itemsMaterialsCollectionsClients.push({
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

	changedItem(item) {}

	async save() {}

	async saveClients() {
		console.log(this.entrieItemsClients);
	}
}
