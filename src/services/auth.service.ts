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
import { request, GraphQLClient } from 'graphql-request'
import { ObserveOnSubscriber } from 'rxjs/internal/operators/observeOn';
import { resolve } from 'q';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  result: any;
  private currenTokenSubject: BehaviorSubject<any>;
  public currentToken: Observable<any>;

  constructor(
    private http: HttpClient,
    private decriptEncript: DecriptEncript
  ) {
    this.currenTokenSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentToken'))
    );
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
  public signup(corporation: Corporation, resolve, reject) {
    if (corporation._id === undefined) {
      this.add(corporation, resolve, reject);
    } else {
      this.update(corporation._id, corporation, resolve, reject);
    }
  }

  async add(corporation: Corporation, resolve, reject) {
    const mutation = /* GraphQL */`
    mutation createCorporation($corporation: CorporationInput!) {
      createCorporation(input: $corporation)  { 
        _id
      }
    }`

    const variables = {
      corporation: corporation,
    }

    const client = new GraphQLClient(environment.database.uri, {
      headers: {}
    })
    try {
      var id = await client.request(mutation, variables);
      if (id) {
        resolve(id);
      }
    } catch (error) {
      reject(error.response.errors[0].message);
    }
  }

  async update(corporationId: string, corporation: Corporation, resolve, reject) {
    const mutation = /* GraphQL */`
    mutation updateCorporation($_id:ID!,$corporation: CorporationInput!) {
      updateCorporation(_id: $_id, input: $corporation)  { 
        _id
      }
    }`

    const variables = {
      _id: corporationId,
      corporation: corporation,
    }

    const client = new GraphQLClient(environment.database.uri, {
      headers: {}
    })
    try {
      var id = await client.request(mutation, variables);
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
    this.currenTokenSubject.next(null);
  }

  public logout() {
    if (!this.isAuthenticated()) {
      return;
    }
    this.cleanStorage();
  }

  public async signIn(email: string, password: string) {
    const query = /* GraphQL */`
    query signIn($email: String!, $password: String!) {
       signIn(email: $email, password:$password)  {
         _id
        users{
          _id
          profile {
            name
            access
          }
          name
          email
          password
          active
        }
      }
    }`

    const variables = {
      email: email,
      password: this.encript(password)
    }

    const client = new GraphQLClient(environment.database.uri, {
      headers: {}
    })
    try {
      var signIn = await client.request(query, variables);
      const isLogged = this.generateToken(signIn['signIn']._id, signIn['signIn'].users[0], password);
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

  async getOrganization(resolve, reject) {
    const _id = JSON.parse(localStorage.getItem('currentUserId'));
    if (_id !== null && _id !== undefined) {
      const query = /* GraphQL */`
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
  }
  }`
      const variables = {
        _id: _id,
      }
      const client = new GraphQLClient(environment.database.uri, {
        headers: {}
      })
      try {
        var getCorporationByUser = await client.request(query, variables);
        if (getCorporationByUser) {
          resolve(getCorporationByUser['getCorporationByUser']);
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

  generateToken(corporationId, user, password): boolean {
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
