import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GraphQLClient } from 'graphql-request';
import { ProviderRegistration } from 'src/models/providerregistration';

@Injectable({
	providedIn: 'root'
})
export class ProviderRegistrationService {
	constructor() {}

	private getPath(): String {
		return environment.database.paths.provider;
	}

	async allProviders(_class, corporationId: string, resolve, reject) {
		if (corporationId !== undefined && corporationId !== null) {
			const query = /* GraphQL */ `
      query allProviders {
					allProviders {
				        _id
						company
						cnpj
						tradingName
						active
						class
						phone
						email
						classification
						cellPhone
						creationDate
						activationDate
						verificationDate
						units {
						_id
						name
						location {
							_id
							country
							state
							latitude
							longitude
							cep
							publicPlace
							neighborhood
							number
							county
							complement
						}
						}
						users {
						_id
						name
						email
						password
						active
						profile {
							name
							access
						}
						}
        }
    }`;

			const client = new GraphQLClient(environment.database.uri + `/${this.getPath()}`, {
				headers: {}
			});

			try {
				var allProviders = await client.request(query);
				if (!allProviders) {
					reject('WRE016');
				} else {
					resolve(allProviders['allProviders']);
				}
			} catch (error) {
				console.log(error);
				throw new Error(error.response.errors[0].message);
			}
		} else {
			reject(undefined);
		}
	}

	addOrUpdate(_class, _id: String, provider: ProviderRegistration, resolve, reject) {
		const mutation = /* GraphQL */ `
    mutation createorUpdateProvider($_id:ID!,$typeCorporation:String, $provider: [ProviderInput]) {
		createorUpdateProvider(_id:$_id, typeCorporation:$typeCorporation, input: $provider)  { 
			_id
			company
			cnpj
			tradingName
			active
			class
			phone
			email
			classification
			cellPhone
			creationDate
			activationDate
			verificationDate
			units {
			_id
			name
			location {
				_id
				country
				state
				latitude
				longitude
				cep
				publicPlace
				neighborhood
				number
				county
				complement
			}
			}
			users {
			_id
			name
			email
			password
			active
			profile {
				name
				access
			}
			}
			}
	}`;

		const variables = {
			_id: _id,
			typeCorporation: _class,
			provider: provider
		};

		const client = new GraphQLClient(environment.database.uri + `/${this.getPath()}`, {
			headers: {}
		});
		try {
			var createorUpdateProvider = client
				.request(mutation, variables)
				.then((createorUpdateProvider) => {
					if (createorUpdateProvider['createorUpdateProvider']) {
						resolve(createorUpdateProvider['createorUpdateProvider']);
					}
				})
				.catch((createorUpdateProvider) => {
					console.log(createorUpdateProvider.response.errors[0].message);
					reject(createorUpdateProvider.response.errors[0].message);
				});
		} catch (error) {
			console.log(error);
			throw new Error(error.response.errors[0].message);
		}
	}
}
