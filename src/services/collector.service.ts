import { Injectable } from '@angular/core';
import { GraphQLClient } from 'graphql-request';
import { environment } from 'src/environments/environment';
import { Corporation } from 'src/models/corporation';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class CollectorService {
	constructor(private http: HttpClient) {}

	private getPath(typeCorporation): String {
		if (typeCorporation === Corporation.Classification.Coletora) {
			return environment.database.paths.collector;
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
		  location
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
}
