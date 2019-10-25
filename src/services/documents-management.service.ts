import { Injectable } from '@angular/core';
import { Document } from 'src/models/document';
import { environment } from 'src/environments/environment';
import { GraphQLClient } from 'graphql-request';
import { Corporation } from 'src/models/corporation';
import { ProviderRegistration } from 'src/models/providerregistration';

@Injectable({
	providedIn: 'root'
})
export class DocumentsManagementService {
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

	async allDocuments(_class, corporationId: string, resolve, reject) {
		if (corporationId !== undefined && corporationId !== null) {
			const query = /* GraphQL */ `
      query allDocuments($_id: ID!) {
        allDocuments(_id: $_id)  {
          _id
          type
          name
          archive
          daysNotification
          date
		  expire
  }
    }`;

			const variables = {
				_id: corporationId
			};

			const client = new GraphQLClient(environment.database.uri + `/${this.getPath(_class)}`, {
				headers: {}
			});

			try {
				var allDocuments = await client.request(query, variables);
				if (!allDocuments) {
					reject('WRE016');
				} else {
					resolve(allDocuments['allDocuments']);
				}
			} catch (error) {
				throw new Error(error.response.errors[0].message);
			}
		} else {
			reject(undefined);
		}
	}

	addOrUpdate(_class, _id: String, document: Document, resolve, reject) {
		const mutation = /* GraphQL */ `
    mutation createorUpdateDocument($_id:ID!, $document: [DocumentInput]) {
      createorUpdateDocument(_id:$_id, input: $document)  { 
        _id
        type
        name
        archive
        daysNotification
        date
		expire
      }
    }`;

		const variables = {
			_id: _id,
			document: document
		};

		const client = new GraphQLClient(environment.database.uri + `/${this.getPath(_class)}`, {
			headers: {}
		});
		var allDocuments = client
			.request(mutation, variables)
			.then((allDocuments) => {
				if (allDocuments['createorUpdateDocument']) {
					resolve(allDocuments['createorUpdateDocument']);
				}
			})
			.catch((allDocuments) => {
				reject(allDocuments.response.errors[0].message);
			});
	}
}
