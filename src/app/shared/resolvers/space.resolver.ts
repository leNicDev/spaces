import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { SpaceService } from '../services/space.service';
import { Observable } from 'rxjs';

@Injectable()
export class SpaceResolver implements Resolve<any> {

  constructor(private spaceService: SpaceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.spaceService.getAllSecrets();
  }
}
