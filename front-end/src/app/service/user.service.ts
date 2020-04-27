import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user.model';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth-utility/auth.service';
import { BehaviorSubject } from 'rxjs';

// @ts-ignore
const config = require('../../assets/config.json')
const url = config.userUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isAuth: boolean;
  $currentUser = new BehaviorSubject<any>(null)

  constructor(private auth: AuthService,
    private http: HttpClient) {
    this.auth.$isAuth.subscribe(auth => {
      if (auth) {
        this.getMe();
      }
      else this.isAuth = false;
    })
  }

  getMe() {
    this.http.get<{ data: any, error: Error }>(url + 'login')
      .pipe(
        map(({ data, error }) => {
          if (error) console.log(error);
          return { data, error };
        })
      )
      .subscribe((result: any) => {
        if (!result.error) {
          this.isAuth = true;
          this.$currentUser.next({user : new User(result.data)})
        }
      })
  }

  checkPassword(password) {
    return this.http.post<{ data: boolean, error: Error }>(url + 'checkPassword', {password}  )
      .pipe(
        map(({ data, error }) => {
          if (error) console.log(error);
          return data;
        }))
  }

  editContacts(data) {
    return this.http.put<{ data: any, error: Error }>(url + 'edit/contacts', data  )
  }

  editPassword(data) {
    return this.http.put<{ data: any, error: Error }>(url + 'edit/password', data  )
      .pipe(
        map(({ data, error }) => {
          if (error) console.log(error);
          return data;
        }))
  }

  getUsersByLetters(letters) {
    return this.http.get<{ data: any, error: Error }>(url + 'friends/search/' + letters)
      .pipe(
        map(({ data, error }) => {
          if (error) console.log(error);
          return { data, error };
        })
      )
  }

  sendFriendRequest(id) {
    return this.http.post<{ data: any, error: Error }>(url + "friends/", { id })
      .pipe(
        map(({ data, error }) => {
          if (error) console.log(error);
          return { data, error };
        })
      )
  }

  getFriendsSend() {
    return this.http.get<{ data: any, error: Error }>(url + "friends/send")
      .pipe(
        map(({ data, error }) => {
          if (error) console.log(error);
          return { data, error };
        })
      )
  }

  getFriendsReceived() {
    return this.http.get<{ data: any, error: Error }>(url + "friends/received")
      .pipe(
        map(({ data, error }) => {
          if (error) console.log(error);
          return { data, error };
        })
      )
  }

  deleteDemand(id) {
    return this.http.get<{ data: any, error: Error }>(url + 'friends/delete/demand/' + id)
      .pipe(
        map(({ data, error }) => {
          if (error) console.log(error);
          return { data, error };
        })
      )
  }

  deleteRequest(id) {
    return this.http.get<{ data: any, error: Error }>(url + 'friends/delete/request/' + id)
      .pipe(
        map(({ data, error }) => {
          if (error) console.log(error);
          return { data, error };
        })
      )
  }

  acceptRequest(id) {
    return this.http.get<{ data: any, error: Error }>(url + 'friends/accept/request/' + id)
      .pipe(
        map(({ data, error }) => {
          if (error) console.log(error);
          return { data, error };
        })
      )
  }

  getFriends() {
    return this.http.get<{ data: any, error: Error }>(url + 'friends')
      .pipe(
        map(({ data, error }) => {
          if (!error) {
            data = data.map(user => {
              return new User(user)
            })
          }
          return { data, error };
        })
      )
  }

  deleteFriend(id) {
    return this.http.get<{ data: any, error: Error }>(url + 'friends/delete/friend/' + id)
      .pipe(
        map(({ data, error }) => {
          if (error) console.log(error);
          return { data, error };
        })
      )
  }

  logout() {
    this.auth.logout();
  }


}
