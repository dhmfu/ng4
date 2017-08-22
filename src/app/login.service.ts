import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoginService {
    constructor(private http: Http) { }

    private headers = new Headers({'Content-Type': 'text/plain'});

    login(user): Promise<any> {
        let body = JSON.stringify({name:user.name.trim(), password:user.password});
        let options = new RequestOptions({ headers: this.headers});

        return this.http.post('http://localhost:3000/api/login', body, options)
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}

export class UserToken {}
export class Permissions {
  canActivate(user: UserToken, id: string): boolean {
    return true;
  }
}

@Injectable()
export class LoggedIn implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean>|boolean {
    this.router.navigate(['login']);
    return false;
  }
}
