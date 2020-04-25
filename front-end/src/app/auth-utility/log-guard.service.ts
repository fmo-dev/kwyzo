import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable()
export class LogGuardService implements CanActivate {

    isAuth: boolean;

    constructor(private auth: AuthService, 
                private router: Router) {
        this.auth.$isAuth.subscribe( value => this.isAuth = value)
    }

    canActivate(): boolean {
        if (this.isAuth) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}