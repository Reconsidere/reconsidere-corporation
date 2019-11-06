import { Pipe, PipeTransform, QueryList } from '@angular/core';
import { MatStepper, MatVerticalStepper } from '@angular/material/stepper';
import { CheckPoints } from 'src/models/checkpoints';

@Pipe({
	name: 'checkpoint'
})
export class CheckpointPipe implements PipeTransform {
	list: any;
	stepper: MatStepper;
	checkpoints: any;
	transform(checkpoints: any, stepper: any): any {
		this.list = [];
		this.stepper = stepper;
		this.checkpoints = checkpoints;
		if (!checkpoints) {
			return checkpoints;
		}
		if (!stepper) {
			return checkpoints;
		}

		this.configureCheckPoint();
		return this.list;
	}

	async configureCheckPoint() {
		if (this.checkpoints.wastegenerated) {
			var code;
			this.checkpoints.wastegenerated.qrCode.forEach((qrCode) => {
				code = qrCode.code;
				this.checkValue(code);
				this.list.push(qrCode);
			});
		}
	}

	async checkValue(code) {
		if (this.checkpoints.collectionrequested) {
			var exist = this.checkpoints.collectionrequested.qrCode.find((x) => x.code === code);
			if (exist) {
				this.stepper.selectedIndex++;
			}
		}
		if (this.checkpoints.collectionperformed) {
			var exist = this.checkpoints.collectionperformed.qrCode.find((x) => x.code === code);
			if (exist) {
				this.stepper.selectedIndex++;
			}
		}
		if (this.checkpoints.arrivedcollector) {
			var exist = this.checkpoints.arrivedcollector.qrCode.find((x) => x.code === code);
			if (exist) {
				this.stepper.selectedIndex++;
			}
		}
		if (this.checkpoints.insorting) {
			var exist = this.checkpoints.insorting.qrCode.find((x) => x.code === code);
			if (exist) {
				this.stepper.selectedIndex++;
			}
		}
		if (this.checkpoints.completedestination) {
			var exist = this.checkpoints.completedestination.qrCode.find((x) => x.code === code);
			if (exist) {
				this.stepper.selectedIndex++;
			}
		}
	}
}
