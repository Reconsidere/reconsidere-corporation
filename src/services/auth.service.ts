import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import jwt from 'jsonwebtoken';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DecriptEncript } from 'src/app/security/decriptencript';
import { Corporation } from 'src/models/corporation';
import { request, GraphQLClient } from 'graphql-request';
import { ObserveOnSubscriber } from 'rxjs/internal/operators/observeOn';
import { resolve } from 'q';
import { MyProviders } from 'src/models/provider';
import { ProviderRegistration } from 'src/models/providerregistration';
import { ProviderRegistrationService } from './provider-registration.service';
@Injectable({
	providedIn: 'root'
})
export class AuthService {
	result: any;
	private currenTokenSubject: BehaviorSubject<any>;
	public currentToken: Observable<any>;
	private mutation;
	private query;

	//#region queries

	private queryProvider = /* GraphQL */ `
	query getProviderByUser($_id: ID!) {
	  getProviderByUser(_id: $_id)  {
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
        _idColector
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
    residuesArrived{
      date
        name
        cost
        typeEntrie
        quantity
        weight
        amount
        observation
	      confirmedByCorporation
	      confirmedByCollector
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

	private queryCorporation = /* GraphQL */ `
	query getCorporationByUser($_id: ID!) {
	  getCorporationByUser(_id: $_id)  {
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
        _idColector
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
    residuesArrived{
      date
        name
        cost
        typeEntrie
        quantity
        weight
        amount
        observation
	      confirmedByCorporation
	      confirmedByCollector
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

	private queryCollector = /* GraphQL */ `
query getCollectorByUser($_id: ID!) {
	getCollectorByUser(_id: $_id)  {
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
        _idColector
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
    residuesArrived{
      date
        name
        cost
        typeEntrie
        quantity
        weight
        amount
        observation
	      confirmedByCorporation
	      confirmedByCollector
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

  //#endregion
  

//#region by id
private queryProviderById = /* GraphQL */ `
	query getProvider($_id: ID!) {
	  getProvider(_id: $_id)  {
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
        _idColector
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
    residuesArrived{
      date
        name
        cost
        typeEntrie
        quantity
        weight
        amount
        observation
	      confirmedByCorporation
	      confirmedByCollector
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

	private queryCorporationById = /* GraphQL */ `
	query getCorporation($_id: ID!) {
	  getCorporation(_id: $_id)  {
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
        _idColector
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
    residuesArrived{
      date
        name
        cost
        typeEntrie
        quantity
        weight
        amount
        observation
	      confirmedByCorporation
	      confirmedByCollector
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

	private queryCollectorById = /* GraphQL */ `
query getCollector($_id: ID!) {
	getCollector(_id: $_id)  {
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
        _idColector
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
    residuesArrived{
      date
        name
        cost
        typeEntrie
        quantity
        weight
        amount
        observation
	      confirmedByCorporation
	      confirmedByCollector
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



//#endregion
  

	//#region mutations

	private mutationCorporationAddUnit = /* GraphQL */ `
  mutation createCorporationUnit($_id:ID!, $typeCorporation:String ,$corporation: [CorporationInput]!) {
    createCorporationUnit(_id: $_id, typeCorporation:$typeCorporation,input: $corporation)  { 
      _id
    }
}`;

	private mutationCollectorAddUnit = /* GraphQL */ `
		mutation createCollectorUnit($_id:ID!, $typeCorporation:String , $corporation: [CollectorInput]!) {
      createCollectorUnit(_id: $_id, typeCorporation:$typeCorporation, input: $corporation)  { 
			_id
		}
		}`;

	private mutationCorporationAdd = /* GraphQL */ `
    mutation createCorporation($corporation: CorporationInput!) {
      createCorporation(input: $corporation)  { 
        _id
      }
	}`;

	private mutationCollectorAdd = /* GraphQL */ `
		mutation createCollector($corporation: CollectorInput!) {
		createCollector(input: $corporation)  { 
			_id
		}
		}`;

	private mutationCorporationUpdate = /* GraphQL */ `
		mutation updateCorporation($_id:ID!,$corporation: CorporationInput!) {
		updateCorporation(_id: $_id, input: $corporation)  { 
			_id
		}
		}`;

	private mutationCollectorUpdate = /* GraphQL */ `
		mutation updateCollector($_id:ID!,$corporation: CollectorInput!) {
			updateCollector(_id: $_id, input: $corporation)  { 
			_id
		}
		}`;

	//#endregion
	constructor(private http: HttpClient, private decriptEncript: DecriptEncript) {
		this.currenTokenSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentToken')));
		this.currentToken = this.currenTokenSubject.asObservable();
	}

	public get currenTokenValue(): any {
		return this.currenTokenSubject.value;
	}

	public isAuthenticated(): boolean {
		if (!environment.production) {
			return true;
		}

		const jwtHelper = new JwtHelperService();
		if (jwtHelper.isTokenExpired(this.currenTokenSubject.value)) {
			this.cleanStorage();
			return false;
		}
		return true;
	}

	public getUserName() {
		return JSON.parse(localStorage.getItem('userName'));
	}

	private getPath(typeCorporation): String {
		if (typeCorporation === Corporation.Classification.Coletora) {
			return environment.database.paths.collector;
		} else if (typeCorporation === ProviderRegistration.Classification.Provider) {
			return environment.database.paths.provider;
		} else {
			return environment.database.paths.corporation;
		}
	}
	public signup(_class, corporation: Corporation, resolve, reject) {
		if (corporation._id === undefined) {
			this.add(_class, corporation, resolve, reject);
		} else {
			this.update(_class, corporation._id, corporation, resolve, reject);
		}
	}

	async add(_class, corporation: Corporation, resolve, reject) {
		const variables = {
			corporation: corporation
		};

		const client = new GraphQLClient(environment.database.uri + `/${this.getPath(corporation.classification)}`, {
			headers: {}
		});

		if (corporation.classification === Corporation.Classification.Coletora) {
			this.mutation = this.mutationCollectorAdd;
		} else {
			this.mutation = this.mutationCorporationAdd;
		}
		try {
			var createCorporation = await client.request(this.mutation, variables);
			if (createCorporation) {
				if (corporation.classification === Corporation.Classification.Coletora) {
					resolve(createCorporation['createCollector']);
				} else {
					resolve(createCorporation['createCorporation']);
				}
			}
		} catch (error) {
			console.log(error);
			reject(error.response.errors[0].message);
		}
	}

	async addUnit(_class, corporationId, typeCorporation, corporation: Corporation, resolve, reject) {
		const variables = {
			_id: corporationId,
			typeCorporation: typeCorporation,
			corporation: corporation
		};

		const client = new GraphQLClient(environment.database.uri + `/${this.getPath(_class)}`, {
			headers: {}
		});

		if (_class === Corporation.Classification.Coletora) {
			this.mutation = this.mutationCollectorAddUnit;
		} else {
			this.mutation = this.mutationCorporationAddUnit;
		}
		try {
			var createCorporationUnit = await client.request(this.mutation, variables);
			if (createCorporationUnit) {
				if (corporation.classification === Corporation.Classification.Coletora) {
					resolve(createCorporationUnit['createCollectorUnit']);
				} else {
					resolve(createCorporationUnit['createCorporationUnit']);
				}
			}
		} catch (error) {
			console.log(error);
			reject(error.response.errors[0].message);
		}
	}

	async update(_class, corporationId: string, corporation: Corporation, resolve, reject) {
		const variables = {
			_id: corporationId,
			corporation: corporation
		};

		const client = new GraphQLClient(environment.database.uri + `/${this.getPath(corporation.class)}`, {
			headers: {}
		});

		if (corporation.class === Corporation.Classification.Coletora) {
			this.mutation = this.mutationCollectorUpdate;
		} else {
			this.mutation = this.mutationCorporationUpdate;
		}

		try {
			var id = await client.request(this.mutation, variables);
			if (id) {
				resolve(id);
			}
		} catch (error) {
			console.log(error);
			reject(error.response.errors[0].message);
		}
	}

	cleanStorage() {
		localStorage.removeItem('currentToken');
		localStorage.removeItem('currentUserId');
		localStorage.removeItem('userName');
		localStorage.removeItem('currentCorporationId');
		localStorage.removeItem('classCorporation');
		this.currenTokenSubject.next(null);
	}

	public logout() {
		if (!this.isAuthenticated()) {
			return;
		}
		this.cleanStorage();
	}

	public async signIn(email: string, password: string) {
		const query = /* GraphQL */ `
    query signIn($email: String!, $password: String!) {
       signIn(email: $email, password:$password)  {
           _id
           classification
          users {
            _id
            name
            email
            password
            active
            profile {
              name
            }
          }
      }
    }`;

		const variables = {
			email: email,
			password: this.encript(password)
		};

		const client = new GraphQLClient(environment.database.uri + `/${environment.database.paths.login}`, {
			headers: {}
		});
		try {
			var signIn = await client.request(query, variables);
			const isLogged = this.generateToken(
				signIn['signIn'].classification,
				signIn['signIn']._id,
				signIn['signIn'].users[0],
				password
			);
			if (!isLogged) {
				throw new Error('ERE001');
			} else {
				return isLogged;
			}
		} catch (error) {
			throw new Error('ERE001');
		}
	}
	getCorporationId() {
		return JSON.parse(localStorage.getItem('currentCorporationId'));
	}

	getClass() {
		return JSON.parse(localStorage.getItem('classCorporation'));
	}

	async getOrganization(_class, resolve, reject) {
		const _id = JSON.parse(localStorage.getItem('currentUserId'));
		if (_id !== null && _id !== undefined) {
			const variables = {
				_id: _id
			};
			const client = new GraphQLClient(environment.database.uri + `/${this.getPath(_class)}`, {
				headers: {}
			});

			if (_class === Corporation.Classification.Coletora) {
				this.query = this.queryCollector;
			} else if (_class === ProviderRegistration.Classification.Provider) {
				this.query = this.queryProvider;
			} else {
				this.query = this.queryCorporation;
			}

			try {
				var getCorporationByUser = await client.request(this.query, variables);
				if (getCorporationByUser) {
					if (_class === Corporation.Classification.Coletora) {
						resolve(getCorporationByUser['getCollectorByUser']);
					} else if (_class === ProviderRegistration.Classification.Provider) {
						resolve(getCorporationByUser['getProviderByUser']);
					} else {
						resolve(getCorporationByUser['getCorporationByUser']);
					}
				} else {
					resolve(undefined);
				}
			} catch (error) {
				console.log(error);
				reject(error.response.errors[0].message);
			}
		} else {
			return new Observable<string>();
		}
  }
  
  
	async getOrganizationById(_class, _id,  resolve, reject) {
		if (_id !== null && _id !== undefined) {
			const variables = {
				_id: _id
			};
			const client = new GraphQLClient(environment.database.uri + `/${this.getPath(_class)}`, {
				headers: {}
			});

			if (_class === Corporation.Classification.Coletora) {
				this.query = this.queryCollectorById;
			} else if (_class === ProviderRegistration.Classification.Provider) {
				this.query = this.queryProviderById;
			} else {
				this.query = this.queryCorporationById;
			}

			try {
				var getCorporationById = await client.request(this.query, variables);
				if (getCorporationById) {
					if (_class === Corporation.Classification.Coletora) {
						resolve(getCorporationById['getCollector']);
					} else if (_class === ProviderRegistration.Classification.Provider) {
						resolve(getCorporationById['getProvider']);
					} else {
						resolve(getCorporationById['getCorporation']);
					}
				} else {
					resolve(undefined);
				}
			} catch (error) {
				console.log(error);
				reject(error.response.errors[0].message);
			}
		} else {
			return new Observable<string>();
		}
	}


	generateToken(_class, corporationId, user, password): boolean {
		if (user) {
			const decryptPass = this.decript(user.password);
			if (password !== decryptPass) {
				return false;
			} else {
				const id = user._id;
				user.token = jwt.sign({ id }, environment.secret, {
					expiresIn: 3600 // uma hora
				});
			}
			localStorage.setItem('currentToken', JSON.stringify(user.token));
			localStorage.setItem('currentUserId', JSON.stringify(user._id));
			localStorage.setItem('userName', JSON.stringify(user.name));
			localStorage.setItem('currentCorporationId', JSON.stringify(corporationId));
			localStorage.setItem('classCorporation', JSON.stringify(_class));
			this.currenTokenSubject.next(user.token);
			return true;
		}
	}

	encript(value) {
		return this.decriptEncript.set(environment.secret, value);
	}

	decript(value) {
		return this.decriptEncript.get(environment.secret, value);
	}
}
