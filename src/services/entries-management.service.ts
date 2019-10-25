import { Injectable } from '@angular/core';
import { GraphQLClient } from 'graphql-request';
import { environment } from 'src/environments/environment';
import { Corporation } from 'src/models/corporation';
import { Entries } from 'src/models/entries';
import { ProviderRegistration } from 'src/models/providerregistration';

@Injectable({
	providedIn: 'root'
})
export class EntriesManagementService {
	constructor() {}

	private getPath(typeCorporation): String {
		if (typeCorporation === Corporation.Classification.Coletora) {
			return environment.database.paths.collector;
		} else if (typeCorporation === ProviderRegistration.Classification.Provider) {
			return environment.database.paths.provider;
		} else {
			return environment.database.paths.corporation;
		}
	}

	async allEntries(_class, corporationId: string, resolve, reject) {
		if (corporationId !== undefined && corporationId !== null) {
			const query = /* GraphQL */ `
      query allEntries($_id: ID!) {
        allEntries(_id: $_id)  {
			_id
			purchase {
			_id
			date
			name
			cost
			typeEntrie
			quantity
			weight
			amount
			qrCode {
				_id
				code
				date
				material {
				_id
				type
				name
				weight
				quantity
				active
				unity
				}
			}
			}
			sale {
		    _id
			date
			name
			cost
			typeEntrie
			quantity
			weight
			amount
			qrCode {
				_id
				code
				date
				material {
				_id
				type
				name
				weight
				quantity
				active
				unity
				}
			}
			}
		}
}`;

			const variables = {
				_id: corporationId
			};

			const client = new GraphQLClient(environment.database.uri + `/${this.getPath(_class)}`, {
				headers: {}
			});

			try {
				var allEntries = await client.request(query, variables);
				if (!allEntries) {
					reject('WRE016');
				} else {
					resolve(allEntries['allEntries']);
				}
			} catch (error) {
				console.log(error);
				throw new Error(error.response.errors[0].message);
			}
		} else {
			reject(undefined);
		}
	}

	addOrUpdate(_class, _id: String, entries: Entries, resolve, reject) {
		const mutation = /* GraphQL */ `
    mutation createorUpdateEntries($_id:ID!, $entries: EntriesInput) {
		createorUpdateEntries(_id:$_id, input: $entries)  { 
			_id
		purchase {
			_id
			date
			name
			cost
			typeEntrie
			quantity
			weight
			amount
			qrCode {
			_id
			code
			date
			material {
				_id
				type
				name
				weight
				quantity
				active
				unity
			}
			}
		}
		sale {
			_id
			date
			name
			cost
			typeEntrie
			quantity
			weight
			amount
			qrCode {
			_id
			code
			date
			material {
				_id
				type
				name
				weight
				quantity
				active
				unity
			}
		}
			
  }
  }
    }`;

		const variables = {
			_id: _id,
			entries: entries
		};

		const client = new GraphQLClient(environment.database.uri + `/${this.getPath(_class)}`, {
			headers: {}
		});
		try {
			var createorUpdateEntries = client
				.request(mutation, variables)
				.then((createorUpdateEntries) => {
					if (createorUpdateEntries['createorUpdateEntries']) {
						resolve(createorUpdateEntries['createorUpdateEntries']);
					}
				})
				.catch((createorUpdateEntries) => {
					reject(createorUpdateEntries.response.errors[0].message);
				});
		} catch (error) {
			console.log(error);
		}
	}
}
