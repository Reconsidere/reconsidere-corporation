import { Component, OnInit, ViewChild, QueryList, ViewChildren, AfterViewInit, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CheckpointService } from 'src/services/checkpoint.service';
import { AuthService } from 'src/services/auth.service';
import * as messageCode from 'message.code.json';
import { MatStepper, MatVerticalStepper } from '@angular/material/stepper';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
	list: any;
	constructor(
		private toastr: ToastrService,
		private checkpointsService: CheckpointService,
		private authService: AuthService,
		private breakpointObserver: BreakpointObserver
	) {
		this.list = [];
		breakpointObserver.observe([ Breakpoints.XSmall, Breakpoints.Small ]).subscribe((result) => {
			this.smallScreen = result.matches;
		});
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

	stepClick(ev) {}
}
