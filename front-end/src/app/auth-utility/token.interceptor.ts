import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { UserService } from '../service/user.service';
import { ActivatedRoute } from '@angular/router';




@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService,
    private user: UserService,
    private route: ActivatedRoute) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.auth.token;
    if (authToken)
      request = request.clone({
        headers: request.headers.set("Authorization", 'Bearer ' + authToken),
      });
    else
      request = request.clone();
    return next.handle(request);
  }
}