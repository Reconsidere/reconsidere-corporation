import { Injectable } from '@angular/core';
import { GraphQLClient } from 'graphql-request';
import { environment } from 'src/environments/environment';
import { Corporation } from 'src/models/corporation';
import { HttpClient } from '@angular/common/http';
import { ProviderRegistration } from 'src/models/providerregistration';

@Injectable({
	providedIn: 'root'
})
export class CollectorService {
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

	async allCollectors(_class, corporationId: string, resolve, reject) {
		if (corporationId !== undefined && corporationId !== null) {
			const query = /* GraphQL */ `
      query allCollectors($_id: ID) {
        allCollectors(_id: $_id)  {
          _id
          company
          cnpj
          tradingName
          active
          phone
          cellPhone
          class
          email
          classification
  }
    }`;

			const variables = {
				_id: undefined
			};

			const client = new GraphQLClient(environment.database.uri + `/${environment.database.paths.collector}`, {
				headers: {}
			});

			try {
				var allCollectors = await client.request(query, variables);
				if (!allCollectors) {
					reject('WRE016');
				} else {
					resolve(allCollectors['allCollectors']);
				}
			} catch (error) {
				throw new Error(error.response.errors[0].message);
			}
		} else {
			reject(undefined);
		}
	}

	async allClientsToCollector(_class, corporationId: string, resolve, reject) {
		if (corporationId !== undefined && corporationId !== null) {
			const query = /* GraphQL */ `
      query allClientsToCollector($_id: ID!) {
        allClientsToCollector(_id: $_id)  {
          _id
          company
          cnpj
          tradingName
          active
          phone
          cellPhone
          class
          email
          classification
    scheduling {
      _id
      hour
      date
      active
      collector {
        _id
        company
        cnpj
        tradingName
        active
        phone
        cellPhone
        class
        email
        classification
      }
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
    entries {
      _id
      purchase {
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
        date
        name
        cost
        typeEntrie
        quantity
        weight
        amount
		_idColector
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
    residuesArrived{
      date
        name
        cost
        typeEntrie
        quantity
        weight
        amount
        observation
	      confirmedByCorporation
	      confirmedByCollector
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

			const client = new GraphQLClient(environment.database.uri + `/${environment.database.paths.collector}`, {
				headers: {}
			});

			try {
				var allClientsToCollector = await client.request(query, variables);
				if (!allClientsToCollector) {
					reject('WRE016');
				} else {
					resolve(allClientsToCollector['allClientsToCollector']);
				}
			} catch (error) {
				throw new Error(error.response.errors[0].message);
			}
		} else {
			reject(undefined);
		}
	}
}
