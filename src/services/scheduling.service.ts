import { Injectable } from '@angular/core';
import { Corporation } from 'src/models/corporation';
import { environment } from 'src/environments/environment';
import { GraphQLClient } from 'graphql-request';
import { Scheduling } from 'src/models/scheduling';

@Injectable({
	providedIn: 'root'
})
export class SchedulingService {
	constructor() {}

	private getPath(typeCorporation): String {
		if (typeCorporation === Corporation.Classification.Coletora) {
			return environment.database.paths.collector;
		} else {
			return environment.database.paths.corporation;
		}
	}

	async allSchedulings(_class, corporationId: string, resolve, reject) {
		if (corporationId !== undefined && corporationId !== null) {
			const query = /* GraphQL */ `
      query allSchedulings($_id: ID!) {
        allSchedulings(_id: $_id)  {
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
    }`;

			const variables = {
				_id: corporationId
			};

			const client = new GraphQLClient(environment.database.uri + `/${this.getPath(_class)}`, {
				headers: {}
			});

			try {
				var allSchedulings = await client.request(query, variables);
				if (!allSchedulings) {
					reject('WRE016');
				} else {
					resolve(allSchedulings['allSchedulings']);
				}
			} catch (error) {
				throw new Error(error.response.errors[0].message);
			}
		} else {
			reject(undefined);
		}
	}

	addOrUpdate(_class, _id: String, scheduling: Scheduling, resolve, reject) {
		const mutation = /* GraphQL */ `
    mutation createorUpdateScheduling($_id:ID!, $scheduling: [SchedulingInput]) {
      createorUpdateScheduling(_id:$_id, input: $scheduling)  { 
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
    }`;

		const variables = {
			_id: _id,
			scheduling: scheduling
		};

		const client = new GraphQLClient(environment.database.uri + `/${this.getPath(_class)}`, {
			headers: {}
		});
		var allSchedulings = client
			.request(mutation, variables)
			.then((allSchedulings) => {
				if (allSchedulings['createorUpdateScheduling']) {
					resolve(allSchedulings['createorUpdateScheduling']);
				}
			})
			.catch((allSchedulings) => {
				console.log(allSchedulings.response.errors[0].message);
				reject(allSchedulings.response.errors[0].message);
			});
	}
}
