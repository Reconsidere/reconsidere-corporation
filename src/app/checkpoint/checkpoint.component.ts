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
	list: any;
	listProvider: any;
	lisUnit: any;
	names: any;
	expandMyCheckPoint;
	expandProviderCheckPoint;
	expandMyUnitsCheckPoint;

	constructor(
		private providerService: ProviderRegistrationService,
		private toastr: ToastrService,
		private checkpointsService: CheckpointService,
		private authService: AuthService,
		private breakpointObserver: BreakpointObserver
	) {
		this.list = [];
		breakpointObserver.observe([ Breakpoints.XSmall, Breakpoints.Small ]).subscribe((result) => {
			this.smallScreen = result.matches;
		});

		this.providerCheckPoint = [];
		this.listProvider = [];
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
		var checkpoints = undefined;
		var providerCheckPoint = undefined;
		var providersID = undefined;
		var corp = undefined;
		try {
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

			providersID = await new Promise((resolve, reject) => {
				providersID = this.providerService.allProvidersId(
					this.authService.getClass(),
					this.corporationId,
					resolve,
					reject
				);
			});

			if (providersID && providersID.length > 0) {
				this.providersID = providersID;

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
						this.providersID = providersID;
						this.providerCheckPoint.push(providerCheckPoint);
					}
				}
			}
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	async configureCheckPoint() {
		if (this.checkpoints.wastegenerated) {
			var code;
			this.checkpoints.wastegenerated.qrCode.forEach((qrCode) => {
				code = qrCode.code;
				var index = 0;
				index = this.checkValue(code);
				qrCode.index = index;
				this.list.push(qrCode);
			});

			this.providersID.forEach((providerID) => {
				var object = {
					name: providerID.tradingName,
					list: []
				};
				this.providerCheckPoint.forEach((providerCheck) => {
					providerCheck.wastegenerated.qrCode.forEach((qrCode) => {
						code = qrCode.code;
						var index = 0;
						index = this.checkValueProvider(code);
						qrCode.index = index;
						if (providerCheck._idCorporation === providerID.providerId) {
							object.list.push(qrCode);
						}
					});
				});
				this.listProvider.push(object);
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

	checkValueProvider(code): number {
		var index = 0;
		if (this.providerCheckPoint.collectionrequested) {
			var exist = this.providerCheckPoint.collectionrequested.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 1;
			}
		}
		if (this.providerCheckPoint.collectionperformed) {
			var exist = this.providerCheckPoint.collectionperformed.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 2;
			}
		}
		if (this.providerCheckPoint.arrivedcollector) {
			var exist = this.providerCheckPoint.arrivedcollector.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 3;
			}
		}
		if (this.providerCheckPoint.insorting) {
			var exist = this.providerCheckPoint.insorting.qrCode.find((x) => x.code === code);
			if (exist) {
				index = 4;
			}
		}
		if (this.providerCheckPoint.completedestination) {
			var exist = this.providerCheckPoint.completedestination.qrCode.find((x) => x.code === code);
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
}
