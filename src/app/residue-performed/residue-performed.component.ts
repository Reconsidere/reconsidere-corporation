import { Component, OnInit } from '@angular/core';
import * as messageCode from 'message.code.json';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/services/auth.service';
import { DepartamentService } from 'src/services/departament.service';
import { ResiduesRegisterService } from 'src/services/residues-register.service';
import { EntriesManagementService } from 'src/services/entries-management.service';
import { SchedulingService } from 'src/services/scheduling.service';
import { EntriesTypes, Entries } from 'src/models/entries';
import { ResiduePerformed } from 'src/models/residueperformed';
import { Corporation } from 'src/models/corporation';
import { ProviderRegistration } from 'src/models/providerregistration';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-residue-performed',
	templateUrl: './residue-performed.component.html',
	styleUrls: [ './residue-performed.component.scss' ]
})
export class ResiduePerformedComponent implements OnInit {
	page: number;
	corporationId: string;
	expand: any;
	entries: any;
	entrieItems: any[];
	itemsMaterials: any[];
	residuesConfirmed: any;
	typeCollector;
	constructor(
		private toastr: ToastrService,
		private authService: AuthService,
		private entriesService: EntriesManagementService,
		private schedulingService: SchedulingService
	) {
		this.residuesConfirmed = Object.values(ResiduePerformed.Confirmed);
	}

	ngOnInit() {
		this.authService.isAuthenticated();
		this.page = 1;
		this.corporationId = this.authService.getCorporationId();
		this.loadValues();
	}

	loadValues() {
		this.entrieItems = [];
		this.itemsMaterials = [];
		this.typeCorporations();
		this.loadMaterials();
		this.loadEntries();
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

	expands() {
		if (this.expand) {
			this.expand = false;
		} else {
			this.expand = true;
		}
	}

	async save() {}
}
