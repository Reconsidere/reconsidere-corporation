import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getAll(corporationId, users) {

  }

  loadUsers(items, users) {
    if (users === undefined) {
      users = items;
    } else {
      users.push(items);
    }
    return users;
  }

  createOrUpdate(corporationId: string, user: User) {
    if (user._id) {
      this.update(corporationId, user);
    } else {
      this.add(corporationId, user);
    }
  }

  add(corporationId: string, user: User) {

  }

  update(organizationId: string, user: User) {

  }
}
