import { Injectable } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {
  
  // you would usually put this in it's own service and not access it directly!
  // this is just for the sake of the demo.
  
  constructor(
    private router: Router
  ) {}

  //isLoggedIn: boolean = true;

  //const lcstouid = localStorage.getItem('loggedInPersonId') || '';

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let isLoggedIn = false;
    const lcstouid = localStorage.getItem('loggedInPersonId') || '';
    if(lcstouid == "") {
      isLoggedIn = false;
    }
    else {
      isLoggedIn = true;
    }
     
    if (isLoggedIn) {
      return true;
    } else {
      //alert("Please login, You are redirected to login page");
      window.location.href = 'https://amplify.ness.com:8080/api/login';
      //this.router.navigate(['/dashboard']);
      return false;
    }
  }

}