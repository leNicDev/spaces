import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StateService } from '../services/state.service';

@Injectable({
  providedIn: 'root'
})
export class HasSpaceGuard implements CanActivate {

  constructor(private state: StateService,
              private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const hasSpace = !!this.state.privateKey && !!this.state.walletAddress && !!this.state.walletBalance;

    if (hasSpace) {
      return true;
    } else {
      // redirect to home page
      this.router.navigate(['/']);
      return false;
    }
  }
  
}
