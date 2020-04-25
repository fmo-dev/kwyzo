import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuardService implements CanActivate {

  isAuth: boolean;

  constructor(public auth: AuthService, public router: Router) {
      this.auth.$isAuth.subscribe( value => this.isAuth = value)
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): boolean {

    if (!this.isAuth) { 
      if(!this.auth.token && state.url == '/') return true
      this.router.navigate(['connexion', {url : state.url}]);
      return false;
    }
    return true;
  }
}