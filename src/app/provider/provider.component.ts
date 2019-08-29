import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/services/auth.service';
import { ProviderRegistrationService } from 'src/services/provider-registration.service';
import * as messageCode from 'message.code.json';
import { ProviderRegistration } from 'src/models/providerregistration';

@Component({
	selector: 'app-provider',
	templateUrl: './provider.component.html',
	styleUrls: [ './provider.component.scss' ]
})
export class ProviderComponent implements OnInit {
	page: number;
	corporationId: string;
	providers: any;
	constructor(
		private toastr: ToastrService,
		private authService: AuthService,
		private providerService: ProviderRegistrationService
	) {}

	ngOnInit() {
		this.authService.isAuthenticated();
		this.page = 1;
		this.corporationId = this.authService.getCorporationId();
		this.providers = [];
		this.loadProviders();
	}

	async loadProviders() {
		var providers = undefined;
		try {
			providers = await new Promise((resolve, reject) => {
				providers = this.providerService.allProviders(
					this.authService.getClass(),
					this.corporationId,
					resolve,
					reject
				);
			});

			if (providers) {
				this.providers = providers;
			}
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	newItem() {
		this.providers.push(new ProviderRegistration());
	}

	veryfyBeforeSave() {
		if (this.providers === undefined || this.providers.length <= 0) {
			this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
			throw new Error();
		}

		this.providers.forEach((provider) => {
			if (provider.email === undefined || provider.email === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (provider.password === undefined || provider.password === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
		});
	}

	async save() {
		try {
			this.veryfyBeforeSave();
			var schedulings = await new Promise(async (resolve, reject) => {
				this.providerService.addOrUpdate(
					this.authService.getClass(),
					this.corporationId,
					this.providers,
					resolve,
					reject
				);
			});
			this.resetProviders(schedulings);
			this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
		} catch (error) {
			this.toastr.warning(messageCode['ERROR'][error]['summary']);
		}
	}
}
