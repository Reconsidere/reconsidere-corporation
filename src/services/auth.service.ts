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
@Injectable({
	providedIn: 'root'
})
export class AuthService {
	result: any;
	private currenTokenSubject: BehaviorSubject<any>;
	public currentToken: Observable<any>;
	private mutation;
	private query;

	//#region mutations

	//#region queries

	private queryCorporation = /* GraphQL */ `
	query getCorporationByUser($_id: ID!) {
	  getCorporationByUser(_id: $_id)  {
		_id
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
		providers{
		  _id
		  providerId
		}
		units {
		  name
		  _id
		  location {
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
		}
		users {
		  _id
		  name
		  email
		  password
		  active
		  profile {
			name
			access
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
}
}`;

	private queryCollector = /* GraphQL */ `
query getCollectorByUser($_id: ID!) {
	getCollectorByUser(_id: $_id)  {
	_id
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
	providers{
	  _id
	  providerId
	}
	units {
	  name
	  _id
	  location {
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
	}
	users {
	  _id
	  name
	  email
	  password
	  active
	  profile {
		name
		access
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
}
}`;

	//#endregion

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
			this.mutation = this.mutationCollectorAdd;
		}

		try {
			var id = await client.request(this.mutation, variables);
			if (id) {
				resolve(id);
			}
		} catch (error) {
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
			console.log(error);
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
			} else {
				this.query = this.queryCorporation;
			}

			try {
				var getCorporationByUser = await client.request(this.query, variables);
				if (getCorporationByUser) {
					if(_class === Corporation.Classification.Coletora){
						resolve(getCorporationByUser['getCollectorByUser']);
					}else{
						resolve(getCorporationByUser['getCorporationByUser']);
					}
				} else {
					resolve(undefined);
				}
			} catch (error) {
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
