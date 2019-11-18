import { Component, OnInit, ViewChild, QueryList, ViewChildren, AfterViewInit, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CheckpointService } from 'src/services/checkpoint.service';
import { AuthService } from 'src/services/auth.service';
import * as messageCode from 'message.code.json';
import { MatStepper, MatVerticalStepper } from '@angular/material/stepper';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ProviderRegistrationService } from 'src/services/provider-registration.service';
import { ProviderRegistration } from 'src/models/providerregistration';
import { Corporation } from 'src/models/corporation';

@Component({
	selector: 'app-checkpoint',
	templateUrl: './checkpoint.component.html',
	styleUrls: [ './checkpoint.component.scss' ]
})
export class CheckpointComponent implements OnInit {
	smallScreen: boolean;
	page: number;
	corporationId: string;
	checkpoints: any;
	providerCheckPoint: any;
	unitCheckPoint: any;
	providersID: any;
	unitsID: any;
	list: any;
	listProvider: any;
	lisUnit: any;
	names: any;
	expandMyCheckPoint;
	expandProviderCheckPoint;
	expandMyUnitsCheckPoint;
	expandCollector;

	constructor(
		private providerService: ProviderRegistrationService,
		private toastr: ToastrService,
		private checkpointsService: CheckpointService,
		private authService: AuthService,
		private breakpointObserver: BreakpointObserver
	) {
		breakpointObserver.observe([ Breakpoints.XSmall, Breakpoints.Small ]).subscribe((result) => {
			this.smallScreen = result.matches;
		});

		this.list = [];
		this.providerCheckPoint = [];
		this.unitCheckPoint = [];
		this.listProvider = [];
		this.lisUnit = [];
		this.providersID = [];
		this.unitsID = [];
	}

	ngOnInit() {
		this.authService.isAuthenticated();
		this.page = 1;
		this.corporationId = this.authService.getCorporationId();
		this.load();
	}

	async load() {
		await this.loadCheckPoints();
		await this.configureCheckPoint();
	}

	async loadCheckPoints() {
		try {
			await this.loadMycheckPoints();
			await this.loadProviders();
			await this.loadUnits();
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	async loadProviders() {
		var providerCheckPoint = undefined;
		var providersID = undefined;
		var corp = undefined;

		providersID = await new Promise((resolve, reject) => {
			providersID = this.providerService.allProvidersId(
				this.authService.getClass(),
				this.corporationId,
				resolve,
				reject
			);
		});

		if (providersID && providersID.length > 0) {
			for (var i = 0; providersID.length > i; i++) {
				corp = await new Promise((resolve, reject) => {
					corp = this.providerService.getProvider(
						ProviderRegistration.Classification.Provider,
						providersID[i].providerId,
						resolve,
						reject
					);
				});
				providerCheckPoint = await new Promise((resolve, reject) => {
					providerCheckPoint = this.checkpointsService.allCheckPoints(
						ProviderRegistration.Classification.Provider,
						providersID[i].providerId,
						resolve,
						reject
					);
				});
				if (providerCheckPoint) {
					providerCheckPoint.tradingName = corp.tradingName;
					providersID.tradingName = corp.tradingName;
					this.providersID.push(providersID);
					this.providerCheckPoint.push(providerCheckPoint);
				}
			}
		}
	}

	async loadMycheckPoints() {
		var checkpoints = undefined;
		checkpoints = await new Promise((resolve, reject) => {
			checkpoints = this.checkpointsService.allCheckPoints(
				this.authService.getClass(),
				this.corporationId,
				resolve,
				reject
			);
		});

		if (checkpoints) {
			this.checkpoints = checkpoints;
		}
	}

	async loadUnits() {
		var corp = undefined;
		var unitCheckPoint = undefined;
		var unitsID = undefined;

		unitsID = await new Promise((resolve, reject) => {
			unitsID = this.authService.getOrganizationById(
				this.authService.getClass(),
				this.corporationId,
				resolve,
				reject
			);
		});

		if (unitsID && unitsID.units.length > 0) {
			for (var i = 0; unitsID.units.length > i; i++) {
				corp = undefined;
				corp = await new Promise((resolve, reject) => {
					corp = this.authService.getOrganizationById(
						Corporation.Classification.Coletora,
						unitsID.units[i].unitsId,
						resolve,
						reject
					);
				});

				if (!corp) {
					corp = await new Promise((resolve, reject) => {
						corp = this.authService.getOrganizationById(
							ProviderRegistration.Classification.Provider,
							unitsID.units[i].unitsId,
							resolve,
							reject
						);
					});
				}
				if (!corp) {
					corp = await new Promise((resolve, reject) => {
						corp = this.authService.getOrganizationById(
							Corporation.Classification.Privada,
							unitsID.units[i].unitsId,
							resolve,
							reject
						);
					});
				}

				unitCheckPoint = await new Promise((resolve, reject) => {
					unitCheckPoint = this.checkpointsService.allCheckPoints(
						corp.classification,
						corp._id,
						resolve,
						reject
					);
				});
				if (unitCheckPoint) {
					unitCheckPoint.tradingName = corp.tradingName;
					unitsID.units[i].tradingName = corp.tradingName;
					this.unitsID.push(unitsID.units[i]);
					this.unitCheckPoint.push(unitCheckPoint);
				}
			}
		}
	}

	async configureCheckPoint() {
		if (this.checkpoints.wastegenerated) {
			var code;
			this.checkpoints.wastegenerated.qrCode.forEach((qrCode) => {
				code = qrCode.code;
				qrCode.expand = true;
				var index = 0;
				index = this.checkValue(code);
				qrCode.index = index;
				this.list.push(qrCode);
			});

			this.providersID.forEach((providers) => {
				providers.forEach((providerID) => {
					var object = {
						expand: true,
						name: providers.tradingName,
						list: []
					};
					this.providerCheckPoint.forEach((providerCheck) => {
						providerCheck.wastegenerated.qrCode.forEach((qrCode) => {
							code = qrCode.code;
							var index = 0;
							qrCode.expand = true;
							index = this.checkValueProvider(code, providerCheck);
							qrCode.index = index;
							if (providerCheck._idCorporation === providerID.providerId) {
								object.list.push(qrCode);
							}
						});
					});
					this.listProvider.push(object);
				});
			});

			this.unitsID.forEach((units) => {
				var object = {
					expand: true,
					name: units.tradingName,
					list: []
				};
				this.unitCheckPoint.forEach((unitCheck) => {
					unitCheck.wastegenerated.qrCode.forEach((qrCode) => {
						code = qrCode.code;
						var index = 0;
						qrCode.expand = true;
						index = this.checkValueUnit(code, unitCheck);
						qrCode.index = index;
						if (unitCheck._idCorporation === units.unitsId) {
							object.list.push(qrCode);
						}
					});
				});
				this.lisUnit.push(object);
			});
		}
	}

	checkValue(code): number {
		var index = 0;
		if (this.checkpoints.collectionrequested) {
			var exist = this.checkpoints.collectionrequested.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 1;
			}
		}
		if (this.checkpoints.collectionperformed) {
			var exist = this.checkpoints.collectionperformed.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 2;
			}
		}
		if (this.checkpoints.arrivedcollector) {
			var exist = this.checkpoints.arrivedcollector.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 3;
			}
		}
		if (this.checkpoints.insorting) {
			var exist = this.checkpoints.insorting.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 4;
			}
		}
		if (this.checkpoints.completedestination) {
			var exist = this.checkpoints.completedestination.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 5;
			}
		}
		return index;
	}

	checkValueUnit(code, unitCheck): number {
		var index = 0;
		if (unitCheck.collectionrequested) {
			var exist = unitCheck.collectionrequested.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 1;
			}
		}
		if (unitCheck.collectionperformed) {
			var exist = unitCheck.collectionperformed.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 2;
			}
		}
		if (unitCheck.arrivedcollector) {
			var exist = unitCheck.arrivedcollector.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 3;
			}
		}
		if (unitCheck.insorting) {
			var exist = unitCheck.insorting.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 4;
			}
		}
		if (unitCheck.completedestination) {
			var exist = unitCheck.completedestination.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 5;
			}
		}
		return index;
	}

	checkValueProvider(code, providerCheck): number {
		var index = 0;
		if (providerCheck.collectionrequested) {
			var exist = providerCheck.collectionrequested.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 1;
			}
		}
		if (providerCheck.collectionperformed) {
			var exist = providerCheck.collectionperformed.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 2;
			}
		}
		if (providerCheck.arrivedcollector) {
			var exist = providerCheck.arrivedcollector.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 3;
			}
		}
		if (providerCheck.insorting) {
			var exist = providerCheck.insorting.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 4;
			}
		}
		if (providerCheck.completedestination) {
			var exist = providerCheck.completedestination.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 5;
			}
		}
		return index;
	}

	expandMyCheckPoints() {
		if (!this.expandMyCheckPoint) {
			this.expandMyCheckPoint = true;
		} else {
			this.expandMyCheckPoint = false;
		}
	}

	expandProviderCheckPoints() {
		if (!this.expandProviderCheckPoint) {
			this.expandProviderCheckPoint = true;
		} else {
			this.expandProviderCheckPoint = false;
		}
	}

	expandMyUnitsCheckPoints() {
		if (!this.expandMyUnitsCheckPoint) {
			this.expandMyUnitsCheckPoint = true;
		} else {
			this.expandMyUnitsCheckPoint = false;
		}
	}

	expandCollectors() {
		if (!this.expandCollector) {
			this.expandCollector = true;
		} else {
			this.expandCollector = false;
		}
	}

	expandItem(item) {
		if (!item.expand) {
			item.expand = true;
		} else {
			item.expand = false;
		}
	}
}
