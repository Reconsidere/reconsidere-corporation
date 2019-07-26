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
			isChanged
            active
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
  }
    }`;

			const variables = {
				_id: corporationId
			};

			const client = new GraphQLClient(environment.database.uri + `/${environment.database.paths.corporation}`, {
				headers: {}
			});

			try {
				var allResiduesRegister = await client.request(query, variables);
				if (!allResiduesRegister) {
					reject('WRE016');
				} else {
					resolve(allResiduesRegister['allResiduesRegister']);
				}
			} catch (error) {
				throw new Error(error.response.errors[0].message);
			}
		} else {
			reject(undefined);
		}
	}

	addOrUpdate(_id: String, residuesRegister: ResiduesRegister, resolve, reject) {
		const mutation = /* GraphQL */ `
    mutation createorUpdateResiduesRegister($_id:ID!, $residuesRegister: ResiduesRegisterInput) {
		createorUpdateResiduesRegister(_id:$_id, input: $residuesRegister)  { 
			departments {
            _id
            name
			isChanged
            description
            active
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
      }
    }`;

		const variables = {
			_id: _id,
			residuesRegister: residuesRegister
		};

		const client = new GraphQLClient(environment.database.uri + `/${environment.database.paths.corporation}`, {
			headers: {}
		});
		var createorUpdateResiduesRegister = client
			.request(mutation, variables)
			.then((createorUpdateResiduesRegister) => {
				if (createorUpdateResiduesRegister['createorUpdateResiduesRegister']) {
					resolve(createorUpdateResiduesRegister['createorUpdateResiduesRegister']);
				}
			})
			.catch((createorUpdateResiduesRegister) => {
				reject(createorUpdateResiduesRegister.response.errors[0].message);
			});
	}
}
