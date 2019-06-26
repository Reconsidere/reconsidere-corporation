import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GraphQLClient } from 'graphql-request';
import { environment } from 'src/environments/environment';
import { Department } from 'src/models/department';

@Injectable({
	providedIn: 'root'
})
export class DepartamentService {
	constructor(private http: HttpClient) {}

	async allDepartaments(corporationId: string, resolve, reject) {
		if (corporationId !== undefined && corporationId !== null) {
			const query = /* GraphQL */ `
      query allDepartments($_id: ID!) {
        allDepartments(_id: $_id)  {
          _id
          name
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
				var allDepartments = await client.request(query, variables);
				if (!allDepartments) {
					reject('WRE016');
				} else {
					resolve(allDepartments['allDepartments']);
				}
			} catch (error) {
				throw new Error(error.response.errors[0].message);
			}
		} else {
			reject(undefined);
		}
	}

	async addOrUpdate(_id: String, department: Department, resolve, reject) {
		const mutation = /* GraphQL */ `
    mutation createorUpdateDepartment($_id:ID!, $department: [DepartmentInput]) {
		createorUpdateDepartment(_id:$_id, input: $department)  { 
		_id
          name
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
            }
        }
      }
    }`;

		const variables = {
			_id: _id,
			department: department
		};

		const client = new GraphQLClient(environment.database.uri, {
			headers: {}
		});
		try {
			var allDepartaments = await client.request(mutation, variables);
			if (allDepartaments['allDepartaments']) {
				resolve(allDepartaments['allDepartaments']);
			}
		} catch (error) {
			reject(error.response.errors[0].message);
		}
	}
}
