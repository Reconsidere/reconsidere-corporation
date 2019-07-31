import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GraphQLClient } from 'graphql-request';
import { environment } from 'src/environments/environment';
import { Department } from 'src/models/department';
import { Corporation } from 'src/models/corporation';

@Injectable({
	providedIn: 'root'
})
export class DepartamentService {
	constructor(private http: HttpClient) {}


	private getPath(typeCorporation): String {
		if (typeCorporation === Corporation.Classification.Coletora) {
			return environment.database.paths.collector;
		} else {
			return environment.database.paths.corporation;
		}
	}

	async allDepartaments(_class, corporationId: string, resolve, reject) {
		if (corporationId !== undefined && corporationId !== null) {
			const query = /* GraphQL */ `
      query allDepartments($_id: ID!) {
        allDepartments(_id: $_id)  {
          _id
          name
          description
		  active
		  isChanged
  }
    }`;

			const variables = {
				_id: corporationId
			};

			const client = new GraphQLClient(environment.database.uri + `/${this.getPath(_class)}`, {
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

	async allDepartamentsName(_class, corporationId: string, resolve, reject) {
		if (corporationId !== undefined && corporationId !== null) {
			const query = /* GraphQL */ `
      query allDepartments($_id: ID!) {
        allDepartments(_id: $_id)  {
          name
  		}
    }`;

			const variables = {
				_id: corporationId
			};

			const client = new GraphQLClient(environment.database.uri + `/${this.getPath(_class)}`, {
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

	addOrUpdate(_class, _id: String, department: Department, resolve, reject) {
		const mutation = /* GraphQL */ `
    mutation createorUpdateDepartment($_id:ID!, $department: [DepartmentInput]) {
		createorUpdateDepartment(_id:$_id, input: $department)  { 
		_id
          name
          description
		  active
		  isChanged
      }
    }`;

		const variables = {
			_id: _id,
			department: department
		};

		const client = new GraphQLClient(environment.database.uri +`/${this.getPath(_class)}`, {
			headers: {}
		});
		var allDepartaments = client
			.request(mutation, variables)
			.then((allDepartaments) => {
				if (allDepartaments['createorUpdateDepartment']) {
					resolve(allDepartaments['createorUpdateDepartment']);
				}
			})
			.catch((allDepartaments) => {
				reject(allDepartaments.response.errors[0].message);
			});
	}
}
