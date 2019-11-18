import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GraphQLClient } from 'graphql-request';
import { Corporation } from 'src/models/corporation';
import { ProviderRegistration } from 'src/models/providerregistration';

@Injectable({
	providedIn: 'root'
})
export class UnitService {
	constructor(private http: HttpClient) {}

	private getPath(typeCorporation): String {
		if (typeCorporation === Corporation.Classification.Coletora) {
			return environment.database.paths.collector;
		} else if (typeCorporation === ProviderRegistration.Classification.Provider) {
			return environment.database.paths.provider;
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
          picture
          company
          cnpj
          tradingName
          active
          class
          phone
          email
          classification
          cellPhone
          creationDate
          activationDate
          verificationDate
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
          units {
            _id
            unitsId
          }
          users {
            _id
            name
            email
            password
            active
            
            
          }
          myProviders {
            _id
            providerId
            
          
          }
          departments {
            _id
            name
            
            description
            active
            isChanged
            qrCode {
              _id
              code
              date
              confirmedByCorporation
			        confirmedByCollector
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
          residuesRegister{
            departments {
              _id
              name
              description
              active
              isChanged
              qrCode {
                _id
                code
                date
                confirmedByCorporation
			          confirmedByCollector
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
          scheduling {
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
              date
              confirmedByCorporation
			        confirmedByCollector
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
          entries {
            _id
            purchase {
              date
              name
              cost
              typeEntrie
              quantity
              weight
              amount
              qrCode {
                _id
                code
                date
                confirmedByCorporation
			          confirmedByCollector
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
            sale {
              date
              name
              cost
              typeEntrie
              quantity
              weight
              amount
              qrCode {
                _id
                code
                date
                confirmedByCorporation
			          confirmedByCollector
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

        residuesPerformed{
      date
        name
        cost
        typeEntrie
        quantity
        weight
        amount
        qrCode {
          _id
          code
          date
          confirmedByCorporation
			    confirmedByCollector
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
				console.log(error);
				throw new Error(error.response.errors[0].message);
			}
		} else {
			reject(undefined);
		}
	}
}
