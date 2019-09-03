import { first } from 'rxjs/operators';
import { User } from './../../../models/user';
import { Location } from './../../../models/location';
import { Observable } from 'rxjs/internal/Observable';
import { Component, OnInit, ViewChild, ElementRef, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from 'src/validations/confirm-password.validator';
import { CNPJValidator } from 'src/validations/valid-cnpj.validator';
import { AuthService } from 'src/services/auth.service';
import { promise, element } from 'protractor';
import { CepService } from 'src/services/cep.service';
import { Unit } from 'src/models/unit';
import { Profile } from 'src/models/myproviders';
import { access } from 'fs';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Corporation } from 'src/models/corporation';
import { UserService } from 'src/services/user.service';
import * as messageCode from 'message.code.json';
import { reject } from 'q';
import { ProviderRegistration } from 'src/models/providerregistration';
import { ProviderRegistrationService } from 'src/services/provider-registration.service';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: [ './sign-up.component.scss' ]
})
export class SignUpComponent implements OnInit {
	isValidPasswordCorporation: boolean;
	isValidPasswordUser: boolean;
	isValidCNPJ: boolean;
	classifications: string[];
	profiles: string[];
	corporation: Corporation;
	user: User;
	passwordUser: string;
	confirmPasswordUser: string;
	myRecaptcha: boolean;
	unit: Unit;
	showUnit: boolean;
	page: number;
	pageUnit: number;
	pageUser: number;
	corporationId: string;
	returnUrl: string;
	isChecked: boolean;
	isLogged: boolean;
	dynamicCnpj: boolean;
	loading: boolean;
	termService: boolean;
	termPrivacity: boolean;

	constructor(
		private authService: AuthService,
		private cepService: CepService,
		private userService: UserService,
		private router: Router,
		private toastr: ToastrService,
		private providerService: ProviderRegistrationService
	) {
		this.classifications = Object.values(Corporation.Classification);
		this.profiles = Object.values(User.Profiles);
		this.corporation = new Corporation();
		this.corporation.active = true;
		this.unit = new Unit();
		this.unit.location = new Location();
		this.user = new User();
		this.user.profile = new Profile();
		this.user.active = true;
	}

	ngOnInit() {
		this.authService.isAuthenticated();
		this.dynamicCnpj = true;
		this.page = 1;
		this.pageUnit = 1;
		this.pageUser = 1;
		this.loading = false;
		this.isLogged = false;
		this.loadOrganization();
	}

	private async loadOrganization() {
		var corporation = undefined;
		try {
			corporation = await new Promise(async (resolve, reject) => {
				corporation = this.authService.getOrganization(this.authService.getClass(), resolve, reject);
			});

			if (corporation === undefined || corporation === null) {
				this.isLogged = false;
				this.termService = false;
				this.termPrivacity = false;
			} else {
				this.corporation = corporation;
				this.termService = true;
				this.termPrivacity = true;
				this.isLogged = true;
				if (this.corporation.classification === ProviderRegistration.Classification.Provider) {
					this.classifications.push(this.corporation.classification);
				}
			}
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	CEPSearch(value, e) {
		if (e.target.value === undefined || e.target.value === '') {
			this.requiredCheck(e);
			return;
		}
		this.loading = true;
		this.cepService.search(value).subscribe((result) => {
			this.loadAddress(result);
		});
	}

	loadAddress(result) {
		if (result === undefined || result === null) {
			this.unit.location = new Location();
		}
		if (result.erro !== undefined && result.erro === true) {
			this.toastr.warning(messageCode['WARNNING']['WRE019']['summary']);
		}
		this.unit.location.cep = result.cep;
		this.unit.location.publicPlace = result.logradouro;
		this.unit.location.complement = result.complemento;
		this.unit.location.neighborhood = result.bairro;
		this.unit.location.county = result.localidade;
		this.unit.location.state = result.uf;
		this.loading = false;
	}

	clean() {
		this.corporation = new Corporation();
		this.corporation.active = true;
		this.unit = new Unit();
		this.unit.location = new Location();
		this.user = new User();
		this.user.profile = new Profile();
		this.user.active = true;
		this.passwordUser = undefined;
	}

	typeCorporation(value, e) {
		if (value === Corporation.Classification.Cooperativa) {
			this.dynamicCnpj = true;
		} else if (value === Corporation.Classification.Privada) {
			this.dynamicCnpj = true;
		} else if (value === Corporation.Classification.Municipio) {
			this.corporation.cnpj = '';
			this.dynamicCnpj = false;
		}
	}

	verifyPasswordUser(e) {
		this.requiredCheck(e);
		if (
			this.passwordUser === undefined ||
			this.passwordUser === '' ||
			(this.confirmPasswordUser === undefined && this.confirmPasswordUser === '')
		) {
			return;
		}
		if (
			this.passwordUser === undefined ||
			this.passwordUser === '' ||
			this.confirmPasswordUser === undefined ||
			this.confirmPasswordUser === ''
		) {
			this.isValidPasswordUser = false;
			return;
		}
		this.user.password = this.passwordUser;
		this.user.password = this.authService.encript(this.user.password);
		this.confirmPasswordUser = this.authService.encript(this.confirmPasswordUser);

		this.isValidPasswordUser = ConfirmPasswordValidator.MatchPassword(this.user.password, this.confirmPasswordUser);
		setTimeout(function() {}.bind(this), 1000);
		if (this.isValidPasswordUser) {
			this.confirmPasswordUser = this.passwordUser;
		} else {
			this.confirmPasswordUser = this.authService.decript(this.confirmPasswordUser);
		}
	}
	requiredCheck(e) {
		if (e.target.value === undefined || e.target.value === '') {
			e.target.classList.add('is-invalid');
		} else {
			e.target.classList.remove('is-invalid');
		}
	}

	verifyCNPJ(e) {
		if (e.target.value === undefined || e.target.value === '') {
			this.requiredCheck(e);
			return;
		}
		this.isValidCNPJ = CNPJValidator.MatchCNPJ(this.corporation.cnpj);
		setTimeout(function() {}.bind(this), 1000);
	}

	veryfyBeforeSave() {
		if (!this.isLogged) {
			if (
				this.corporation.email === undefined ||
				this.corporation.company === undefined ||
				this.corporation.tradingName === undefined ||
				this.corporation.phone === undefined ||
				this.corporation.cellPhone === undefined ||
				this.corporation.classification === undefined ||
				this.termPrivacity === false ||
				this.termService === false
			) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				return false;
			}
		} else if (
			this.corporation.email === undefined ||
			this.corporation.company === undefined ||
			this.corporation.tradingName === undefined ||
			this.corporation.phone === undefined ||
			this.corporation.cellPhone === undefined ||
			this.corporation.classification === undefined ||
			this.corporation.company === undefined ||
			this.corporation.units === undefined ||
			this.corporation.units.length <= 0 ||
			this.termPrivacity === false ||
			this.termService === false
		) {
			this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
			return false;
		}
		if (this.corporation.classification !== Corporation.Classification.Municipio) {
			if (this.corporation.cnpj === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				return false;
			}
		}

		let valid = (this.isValidCNPJ = CNPJValidator.MatchCNPJ(this.corporation.cnpj));
		if (!valid) {
			this.toastr.warning(messageCode['WARNNING']['WRE002']['summary']);
			return false;
		} else {
			return true;
		}
	}

	onScriptLoad() {
		console.log('Google reCAPTCHA loaded and is ready for use!');
	}

	onScriptError() {
		console.log('Something went long when loading the Google reCAPTCHA');
	}

	addOrUpdateLocation() {
		let add = false;
		if (!this.veryfyBeforeAddLocation()) {
			return;
		}

		if (this.corporation.units === undefined && this.unit._id === undefined) {
			const unit = new Unit();
			unit.name = this.unit.name;
			unit.location = this.unit.location;
			this.corporation.units = [ unit ];
			add = true;
		} else if (this.corporation.units !== undefined) {
			this.corporation.units.forEach((unit, index) => {
				if (this.unit === unit) {
					this.corporation.units[index] = unit;
					this.corporation.units[index].name = this.unit.name;
					add = true;
				}
			});
		}
		if (!add) {
			this.corporation.units.push(this.unit);
		}
		this.cleanLocation();
		this.showUnit = true;
		this.toastr.info(messageCode['INFO']['IRE002']['summary']);
	}

	cleanLocation() {
		this.unit = new Unit();
		this.unit.location = new Location();
	}

	veryfyBeforeAddLocation() {
		if (this.unit.location === undefined) {
			this.toastr.warning(messageCode['WARNNING']['WRE003']['summary']);
			return false;
		}
		if (
			this.unit.location.state === undefined ||
			this.unit.location.cep === undefined ||
			this.unit.location.publicPlace === undefined ||
			this.unit.location.neighborhood === undefined ||
			this.unit.location.number === undefined ||
			this.unit.location.number < 0 ||
			this.unit.location.county === undefined
		) {
			this.toastr.warning(messageCode['WARNNING']['WRE004']['summary']);
			return false;
		}
		return true;
	}

	enableDisbale(item, e) {
		item.active = e.checked;
	}

	addOrUpdateUser() {
		let add = false;
		if (!this.veryfyBeforeAddUser()) {
			return;
		}
		if (this.corporation.users === undefined && this.user._id === undefined) {
			this.corporation.users = [ this.user ];
			this.cleanUser();
		} else if (this.corporation.users !== undefined) {
			this.corporation.users.forEach((user, index) => {
				if (this.user === user) {
					this.corporation.users[index] = user;
					add = true;
				}
			});
			if (!add) {
				this.corporation.users.push(this.user);
			}
			this.cleanUser();
		}
		this.toastr.info(messageCode['INFO']['IRE003']['summary']);
	}
	cleanUser() {
		this.user = new User();
		this.user.profile = new Profile();
		this.user.active = true;
		if (this.isChecked !== undefined) {
			this.isChecked = undefined;
		} else {
			this.isChecked = false;
		}
		this.confirmPasswordUser = undefined;
		this.passwordUser = undefined;
	}

	veryfyBeforeAddUser() {
		if (this.user === undefined) {
			this.toastr.warning(messageCode['WARNNING']['WRE004']['summary']);
			return false;
		}
		if (
			this.user.email === undefined ||
			this.user.name === undefined ||
			this.user.password === undefined ||
			this.user.active === undefined
		) {
			this.toastr.warning(messageCode['WARNNING']['WRE004']['summary']);
			return false;
		}
		return true;
	}

	editUser(user: any) {
		this.user = user;
		if (this.user._id) {
			this.passwordUser = this.authService.decript(user.password);
			this.confirmPasswordUser = this.passwordUser;
		}
		if (this.user._id === undefined || this.user._id === '') {
			this.passwordUser = this.authService.decript(this.user.password);
			this.confirmPasswordUser = this.passwordUser;
		}
	}
	editLocation(unit: any) {
		this.unit = unit;
	}

	removeUnit(unit) {
		this.corporation.units.forEach((item, index) => {
			if (item === unit) {
				this.corporation.units.splice(index, 1);
				this.toastr.info(messageCode['INFO']['IRE004']['summary']);
			} else {
			}
		});
	}

	/**Remove from the list, if user not exist in database, if user exist dont remove from the list
   * because delete is blocked. Is permited only remove new user.
   */
	removeUser(user) {
		if (this.user._id === undefined) {
			this.corporation.users.forEach((item, index) => {
				if (item === user) {
					this.corporation.users.splice(index, 1);
					this.toastr.info(messageCode['INFO']['IRE005']['summary']);
				} else {
				}
			});
		}
	}

	getAdmProfile() {
		const prof = new Profile();
		prof.name = User.Profiles.Administrator;
		prof.access = [ User.Profiles.Administrator ];
		return prof;
	}

	async save() {
		if (!this.isLogged) {
			this.user.profile = this.getAdmProfile();
			this.user.active = true;
			this.veryfyBeforeAddUser();
			this.corporation.active = true;
			this.corporation.users = [ this.user ];
		}

		if (!this.myRecaptcha) {
			this.toastr.info(messageCode['INFO']['IRE006']['summary']);
			return;
		}

		if (!this.veryfyBeforeSave()) {
			return;
		}

		if (this.corporation._id === undefined) {
			this.corporation.creationDate = new Date();
		}

		try {
			if (this.corporation.classification === ProviderRegistration.Classification.Provider) {
				var _id;
				_id = await new Promise(async (resolve, reject) => {
					this.providerService.addOrUpdate(
						this.authService.getClass(),
						this.corporation._id,
						this.corporation,
						resolve,
						reject
					);
				});
				if (_id && !this.isLogged) {
					this.router.navigate([ '/' ]);
				}
			} else {
				var _id;
				_id = await new Promise(async (resolve, reject) => {
					this.authService.signup(this.corporation.classification, this.corporation, resolve, reject);
				});
				if (_id && !this.isLogged) {
					this.router.navigate([ '/' ]);
				}
			}

			this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}
}
