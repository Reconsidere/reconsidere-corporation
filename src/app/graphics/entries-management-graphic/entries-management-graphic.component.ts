import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { EntriesManagementService } from 'src/services/entries-management.service';
import { SchedulingService } from 'src/services/scheduling.service';
import { Entries, EntriesTypes } from 'src/models/entries';
import * as messageCode from 'message.code.json';
import { ToastrService } from 'ngx-toastr';
import { QrCode } from 'src/models/qrcode';
import { type } from 'os';

@Component({
	selector: 'app-entries-management-graphic',
	templateUrl: './entries-management-graphic.component.html',
	styleUrls: [ './entries-management-graphic.component.scss' ]
})
export class EntriesManagementGraphicComponent implements OnInit {
	page: number;
	corporationId: string;
	entries: any;
	entrieItems: any[];
	itemsMaterials: any[];
	types: any[];
	typeEntrie: any[];
	data: any;
	options: any;
	typesMaterials: any[];
	collectors: any[];
	materials: any[];
	dateInitial;
	dateFinal;
	collector;
	material;

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
	}

	async loadValues() {
		this.entrieItems = [];
		this.itemsMaterials = [];
		this.entries = new Entries();
		this.typesMaterials = [];
		this.collectors = [];
		this.materials = [];
		await this.loadMaterials();
		await this.loadEntries();
		await this.loadTypesMaterials();
		await this.loadColectors();
		await this.generateBarGraph(this.entrieItems);
	}

	async loadColectors() {
		var index;
		this.entrieItems.forEach((items) => {
			index = this.collectors.findIndex((x) => x === items.collector.company);
			if (index === -1) {
				this.collectors.push(items.collector.company);
			}
		});
	}

	async loadTypesMaterials() {
		var index;
		this.entrieItems.forEach((items) => {
			index = this.typesMaterials.findIndex((x) => x === items.qrCode.material.type);
			if (index === -1) {
				this.typesMaterials.push(items.qrCode.material.type);
			}
		});
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
					date: new Date(item.date),
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

	generateBarGraph(item) {
		if (!item || item.length <= 0) {
			item = this.entrieItems;
		}
		var datasets = [];
		var dataset;
		var isSale;
		var exist;
		var amount;
		this.typesMaterials.forEach((type) => {
			amount = 0;
			exist = false;
			isSale = false;
			item.forEach((entrie) => {
				if (entrie.type === EntriesTypes.Type.Output) {
					isSale = true;
					if (type === entrie.qrCode.material.type) {
						amount += entrie.amount;
						exist = true;
						isSale = true;
					}
				} else {
					isSale = false;
				}
			});

			if (isSale && exist) {
				dataset = {
					label: [ type ],
					backgroundColor: this.dynamicColors(),
					borderColor: this.dynamicColors(),
					data: [ amount ]
				};

				datasets.push(dataset);
			}
		});

		this.data = {
			labels: [ 'Categoria' ],
			datasets
		};
	}

	private dynamicColors() {
		var r = Math.floor(Math.random() * 255);
		var g = Math.floor(Math.random() * 255);
		var b = Math.floor(Math.random() * 255);
		return 'rgb(' + r + ',' + g + ',' + b + ')';
	}
}
