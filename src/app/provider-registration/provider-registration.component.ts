import { Component, OnInit } from '@angular/core';
import * as messageCode from 'message.code.json';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/services/auth.service';
import { ProviderRegistrationService } from 'src/services/provider-registration.service';
import { ProviderRegistration } from 'src/models/providerregistration';
import { User } from 'src/models/user';

@Component({
	selector: 'app-provider-registration',
	templateUrl: './provider-registration.component.html',
	styleUrls: [ './provider-registration.component.scss' ]
})
export class ProviderRegistrationComponent implements OnInit {
	page: number;
	corporationId: string;
	newProviders: any;
	providers: any;
	constructor(
		private toastr: ToastrService,
		private authService: AuthService,
		private providerService: ProviderRegistrationService
	) {
		this.newProviders = [];
		this.providers = [];
	}

	ngOnInit() {
		this.authService.isAuthenticated();
		this.page = 1;
		this.corporationId = this.authService.getCorporationId();
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

			if (providers !== undefined && providers.length > 0) {
				this.providers = providers;
			}
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	newItem() {
		var item = new ProviderRegistration();
		item.active = true;
		item.classification = ProviderRegistration.Classification.Provider;
		var user = new User();
		item.users = [ user ];
		this.newProviders.push(item);
	}

	verifyPassword(item) {
		if (item.password === undefined || item.password === '') {
			return;
		}
		item.password = this.authService.encript(item.password);
	}

	veryfyBeforeSave() {
		if (this.newProviders === undefined || this.newProviders.length <= 0) {
			this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
			throw new Error();
		}

		this.newProviders.forEach((provider) => {
			if (provider.users === undefined || provider.users.length <= 0) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			provider.users.forEach((user) => {
				if (user.email === undefined || user.email === undefined) {
					this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
					throw new Error();
				}
				if (user.password === undefined || user.password === undefined) {
					this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
					throw new Error();
				}
			});
		});
	}

	async save() {
		try {
			this.veryfyBeforeSave();
			var provider = await new Promise(async (resolve, reject) => {
				this.providerService.addOrUpdate(
					this.authService.getClass(),
					this.corporationId,
					this.newProviders,
					resolve,
					reject
				);
			});
			this.resetProviders(provider);
			this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
		} catch (error) {
			this.toastr.warning(messageCode['ERROR'][error]['summary']);
		}
	}

	resetProviders(item) {
		this.providers = item;
		this.newProviders = [];
	}
}
