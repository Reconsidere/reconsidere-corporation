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
import { request } from 'graphql-request'

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
  public signup(corporation: Corporation) {
    if (corporation._id === undefined) {
      this.add(corporation);
    } else {
      this.update(corporation._id, corporation);
    }
  }

  add(corporation: Corporation) {

  }

  update(organizationId: string, corporation: Corporation) {

  }

  cleanStorage() {
    localStorage.removeItem('currentToken');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('userName');
    this.currenTokenSubject.next(null);
  }

  public logout() {
    if (!this.isAuthenticated()) {
      return;
    }
    this.cleanStorage();
  }

  public signIn(email: string, password: string) {
    const query = `{
      signIn(email: ${email},password:${password}) {
        users{
          _id
          profile {
            name
            access
          }
          email
          password
          active
        }
      }
    }`

    request(environment.database.uri, query).then(data =>
      console.log(data)
    );
  }
  getOrganizationId(): Observable<string> {
    return null;
  }

  getOrganization(id, organization) {
  }

  generateToken(user, password): boolean {
    return null;
  }

  encript(value) {
  }

  decript(value) {
  }
}
