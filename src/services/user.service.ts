import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User } from 'src/models/user';
import { Corporation } from 'src/models/corporation';
import { ProviderRegistration } from 'src/models/providerregistration';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	constructor(private http: HttpClient) {}

	private getPath(typeCorporation): String {
		if (typeCorporation === Corporation.Classification.Coletora) {
			return environment.database.paths.collector;
		} else if (typeCorporation === ProviderRegistration.Classification.Provider) {
			return environment.database.paths.provider;
		} else {
			return environment.database.paths.corporation;
		}
	}

	getAll(corporationId, users) {}

	loadUsers(items, users) {
		if (users === undefined) {
			users = items;
		} else {
			users.push(items);
		}
		return users;
	}

	createOrUpdate(corporationId: string, user: User) {
		if (user._id) {
			this.update(corporationId, user);
		} else {
			this.add(corporationId, user);
		}
	}

	add(corporationId: string, user: User) {}

	update(organizationId: string, user: User) {}
}
