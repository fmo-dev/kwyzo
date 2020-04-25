import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

// @ts-ignore
const config = require('../../assets/config.json')
const url = config.authUrl;


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  token: string;
  $isAuth = new BehaviorSubject<boolean>(false);

  constructor(private router: Router,
    private http: HttpClient) {
    let token = localStorage.getItem('token')
    if(token != undefined) this.token = token;
  }


  create(user: any) {
    return this.http.post<{ data: any, error: Error }>(url, user)
      .pipe(
        map(({ data, error }) => {
          return { data, error }
        })
      )
  }

  createToken = (user) => {
    this.token = user.token;
    localStorage.setItem('token', user.token);
    this.$isAuth.next(true);
  }

  async externAuth(app, url) {
    window.open('http://localhost:8080/api/auth/' + app, "window", "location=1,status=1,scrollbars=1, width=500,height=500"); 
    let callback = (result) => {
      console.log(result);
      
      const user = result.data.user
      if (user) this.createToken(user)
      this.router.navigate([url])
      window.removeEventListener('message', callback)
    }
    window.addEventListener('message', callback)
  }


  logIn(user: any) {
    return new Promise((resolve, reject) => {
      this.http.post(url + "login", user)
        .subscribe((data: any) => {
          const user = data.user;
          if (user.error) reject(user.error)
          else this.createToken(user)
          resolve();
        },
          error => {
            reject(error)
          }
        )
    })
  }

  logWithToken(routeUrl) {
    return new Promise((resolve, reject) => {
      this.http.post(url + "relog", { token : this.token })
        .subscribe((data: any) => {
          const user = data.data;
          if (user.error) reject(user.error);
          else {
            this.$isAuth.next(true);
            this.router.navigate([routeUrl])
          }
          resolve();
        },
          error => {
            reject(error)
          }
        )
    })
  }

  logout() {
    this.$isAuth.next(false);
    this.token = null;
    localStorage.removeItem('token')
  }

}