import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { LoginService} from './login.service';

import { Observable } from 'rxjs/Observable';
import { map, take, tap } from 'rxjs/operators';
import { promise } from 'protractor';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: LoginService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  Promise<boolean> | boolean {

    return this.authService.adminList(this.authService.userUid).then((value)=>{
        if(!value){
            console.log('access denied');
            this.router.navigate(['']);
        }
        return value;
      });
}
}

