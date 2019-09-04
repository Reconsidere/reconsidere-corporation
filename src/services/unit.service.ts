import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GraphQLClient } from 'graphql-request';
import { Corporation } from 'src/models/corporation';

@Injectable({
	providedIn: 'root'
})
export class UnitService {
	constructor(private http: HttpClient) {}

	private getPath(typeCorporation): String {
		if (typeCorporation === Corporation.Classification.Coletora) {
			return environment.database.paths.collector;
		} else {
			return environment.database.paths.corporation;
		}
	}

	async allUnits(_class, corporationId: string, resolve, reject) {
		if (corporationId !== undefined && corporationId !== null) {
			const query = /* GraphQL */ `
      query allUnits($_id: ID!) {
        allUnits(_id: $_id)  {
          _id
          name
		  picture
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
    }`;

			const variables = {
				_id: corporationId
			};

			const client = new GraphQLClient(environment.database.uri + `/${this.getPath(_class)}`, {
				headers: {}
			});

			try {
				var allUnits = await client.request(query, variables);
				if (!allUnits) {
					reject('WRE016');
				} else {
					resolve(allUnits['allUnits']);
				}
			} catch (error) {
				throw new Error(error.response.errors[0].message);
			}
		} else {
			reject(undefined);
		}
	}
}
