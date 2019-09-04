import { Injectable } from '@angular/core';
import { Picture } from 'src/models/picture';
import { GraphQLClient } from 'graphql-request';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class PictureService {
	constructor() {}

	uploadImage(_id: String, picture: Picture, resolve, reject) {
		const mutation = /* GraphQL */ `
    mutation uploadImage($_id:ID, $picture: PictureInput!) {
      uploadImage(_id:$_id, input: $picture)  { 
		  image{
				name
				type
				size
		  }
	      name
	      extension
      }
    }`;

		const variables = {
			_id: _id,
			picture: picture
		};

		const client = new GraphQLClient(environment.database.uri + `/${environment.database.paths.images}`, {
			headers: {}
		});
		var uploadImage = client
			.request(mutation, variables)
			.then((uploadImage) => {
				if (uploadImage['uploadImage']) {
					resolve(uploadImage['uploadImage']);
				}
			})
			.catch((uploadImage) => {
				console.log(uploadImage.response.errors[0].message);
				reject(uploadImage.response.errors[0].message);
			});
	}
}
