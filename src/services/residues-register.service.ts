import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GraphQLClient } from 'graphql-request';
import { environment } from 'src/environments/environment';
import { ResiduesRegister } from 'src/models/residuesregister';

@Injectable({
	providedIn: 'root'
})
export class ResiduesRegisterService {
	constructor(private http: HttpClient) {}

	async allResiduesRegister(corporationId: string, resolve, reject) {
		if (corporationId !== undefined && corporationId !== null) {
			const query = /* GraphQL */ `
      query allResiduesRegister($_id: ID!) {
        allResiduesRegister(_id: $_id)  {
          departments {
            _id
            name
            description
            active
            qrCode {
              _id
              description
              code
              material {
                _id
                type
                name
                weight
                quantity
                active
              }
            }
  }
  }
    }`;

			const variables = {
				_id: corporationId
			};

			const client = new GraphQLClient(environment.database.uri, {
				headers: {}
			});

			try {
				var allResiduesRegister = await client.request(query, variables);
				if (!allResiduesRegister) {
					reject('WRE016');
				} else {
					resolve(allResiduesRegister['allResiduesRegister'][0]);
				}
			} catch (error) {
				throw new Error(error.response.errors[0].message);
			}
		} else {
			reject(undefined);
		}
	}

	addOrUpdate(_id: String, residueRegister: ResiduesRegister, resolve, reject) {
		const mutation = /* GraphQL */ `
    mutation createorUpdateResiduesRegister($_id:ID!, $residueRegister: [ResiduesRegisterInput]) {
		createorUpdateResiduesRegister(_id:$_id, input: $residueRegister)  { 
		_id
          name
          description
		  active
      }
    }`;

		const variables = {
			_id: _id,
			residueRegister: residueRegister
		};

		const client = new GraphQLClient(environment.database.uri, {
			headers: {}
		});
		var allResiduesRegister = client
			.request(mutation, variables)
			.then((allResiduesRegister) => {
				if (allResiduesRegister['allResiduesRegister']) {
					resolve(allResiduesRegister['allResiduesRegister']);
				}
			})
			.catch((allResiduesRegister) => {
				reject(allResiduesRegister.response.errors[0].message);
			});
	}
}
