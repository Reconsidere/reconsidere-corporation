import { Injectable } from '@angular/core';
import { Archive } from 'src/models/archive';
import { environment } from 'src/environments/environment';
import { GraphQLClient } from 'graphql-request';

@Injectable({
	providedIn: 'root'
})
export class ArchiveService {
	constructor() {}

	uploadArchive(_id: String, archive: Archive, resolve, reject) {
		const mutation = /* GraphQL */ `
    mutation uploadArchive($_id:ID, $archive: ArchiveInput!) {
      uploadArchive(_id:$_id, input: $archive)  { 
		  file
	      name
	      extension
      }
    }`;

		const variables = {
			_id: _id,
			archive: archive
		};

		const client = new GraphQLClient(environment.database.uri + `/${environment.database.paths.archives}`, {
			headers: {}
		});
		var uploadArchive = client
			.request(mutation, variables)
			.then((uploadArchive) => {
				if (uploadArchive['uploadArchive']) {
					resolve(uploadArchive['uploadArchive']);
				}
			})
			.catch((uploadArchive) => {
				console.log(uploadArchive.response.errors[0].message);
				reject(uploadArchive.response.errors[0].message);
			});
	}
}
