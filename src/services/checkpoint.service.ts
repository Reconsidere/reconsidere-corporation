import { Injectable } from '@angular/core';
import { Corporation } from 'src/models/corporation';
import { environment } from 'src/environments/environment';
import { ProviderRegistration } from 'src/models/providerregistration';
import { GraphQLClient } from 'graphql-request';

@Injectable({
	providedIn: 'root'
})
export class CheckpointService {
	constructor() {}

	private getPath(): String {
		return environment.database.paths.checkpoint;
	}


	async allCheckPoints(_class, corporationId: string, resolve, reject) {
		if (corporationId !== undefined && corporationId !== null) {
			const query = /* GraphQL */ `
      query allCheckPoint($_idCorporation: ID!) {
        allCheckPoint(_idCorporation: $_idCorporation)  {
          _idCorporation
            wastegenerated{
              qrCode {
                _id
                code
                date
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
          collectionrequested{
              qrCode {
              _id
              code
              date
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
          collectionperformed{
              qrCode {
              _id
              code
              date
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
          arrivedcollector{
              qrCode {
              _id
              code
              date
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
          insorting{
              qrCode {
              _id
              code
              date
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
          completedestination{
              qrCode {
              _id
              code
              date
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
				_idCorporation: corporationId
			};

			const client = new GraphQLClient(environment.database.uri + `/${this.getPath()}`, {
				headers: {}
			});

			try {
				var allCheckPoint = await client.request(query, variables);
				if (!allCheckPoint) {
					reject('WRE016');
				} else {
					resolve(allCheckPoint['allCheckPoint']);
				}
			} catch (error) {
				throw new Error(error.response.errors[0].message);
			}
		} else {
			reject(undefined);
		}
	}
}
