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

    logout(): Promise<any> {
        let options = new RequestOptions({ headers: new Headers({'x-access-token': localStorage.getItem('token')})});

        return this.http.post('http://localhost:3000/api/logout', {}, options)
               .toPromise()
               .then(response => {
                   localStorage.removeItem('token');
                   console.log(response);
                   return response.json();
               })
               .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}

@Injectable()
export class LoggedIn implements CanActivate {
  constructor(private router: Router, private http: Http) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>|boolean {

      let forLogin = route.url[0].path == 'new-post' || route.url[0].path == 'login';

      let url = 'http://localhost:3000/api/loggedin?token='
      +localStorage.getItem("token")+'&forLogin='+forLogin;

      return this.http.get(url).toPromise()
             .then(response => {
                //  console.log(response.json());
                 return true;
             })
             .catch(error => {
                //  console.error('An error occurred', error);
                 return false;
             });
  }

}
