import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {map, take} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class CanActivateGuardService implements CanActivate {
  constructor(private auth: AngularFireAuth,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> |
    Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.user.pipe(take(1), map(user => {
      const isAuth = !!user;
      if (isAuth) {
        return true;
      }
      return this.router.createUrlTree(['/']);
    }));
  }
}
