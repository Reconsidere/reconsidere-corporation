import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GraphQLClient } from 'graphql-request';
import { ProviderRegistration } from 'src/models/providerregistration';
import { Corporation } from 'src/models/corporation';

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
						picture
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
    units {
      _id
      unitsId
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
						myProviders {
      						_id
      						providerId
							  
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

	async allProvidersId(_class, corporationId: string, resolve, reject) {
		if (corporationId !== undefined && corporationId !== null) {
			const query = /* GraphQL */ `
      query allProvidersId($_id: ID!) {
        allProvidersId(_id: $_id)  {
			_id
		  providerId
  }
    }`;

			const variables = {
				_id: corporationId
			};

			var path;
			if (_class === Corporation.Classification.Coletora) {
				path = environment.database.paths.collector;
			} else if (_class === ProviderRegistration.Classification.Provider) {
				path = environment.database.paths.provider;
			} else {
				path = environment.database.paths.corporation;
			}

			const client = new GraphQLClient(environment.database.uri + `/${path}`, {
				headers: {}
			});

			try {
				var allProvidersId = await client.request(query, variables);
				if (!allProvidersId) {
					reject('WRE016');
				} else {
					resolve(allProvidersId['allProvidersId']);
				}
			} catch (error) {
				console.log(error);
				throw new Error(error.response.errors[0].message);
			}
		} else {
			reject(undefined);
		}
	}

	async getProvider(_class, corporationId: string, resolve, reject) {
		if (corporationId !== undefined && corporationId !== null) {
			const query = /* GraphQL */ `
      query getProvider($_id: ID!) {
		getProvider(_id: $_id) {
			_id
			picture
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
        }
	}`;

			const variables = {
				_id: corporationId
			};
			var path;
			if (_class === Corporation.Classification.Coletora) {
				path = environment.database.paths.collector;
			} else if (_class === ProviderRegistration.Classification.Provider) {
				path = environment.database.paths.provider;
			} else {
				path = environment.database.paths.corporation;
			}

			const client = new GraphQLClient(environment.database.uri + `/${path}`, {
				headers: {}
			});

			try {
				var getProvider = await client.request(query, variables);
				if (!getProvider) {
					reject('WRE016');
				} else {
					resolve(getProvider['getProvider']);
				}
			} catch (error) {
				console.log(error);
				throw new Error(error.response.errors[0].message);
			}
		} else {
			reject(undefined);
		}
	}

	addOrUpdate(_class, _id: String, provider: any, resolve, reject) {
		const mutation = /* GraphQL */ `
    mutation createorUpdateProvider($_id:ID!, $typeCorporation:String, $provider: [ProviderInput]) {
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
    units {
      _id
      unitsId
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
			myProviders {
      						_id
      						providerId
							
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
