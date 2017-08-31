import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    private headers = new Headers({'Content-Type': 'text/plain', 'x-access-token': localStorage.getItem('token')});

    createUser(user): Promise<any>{
        let body = JSON.stringify(user);
        let options = new RequestOptions({ headers: this.headers});

        return this.http.post('http://localhost:3000/api/users/new', user, options)
               .toPromise()
               .then(response => {
                   let posts = response.json();
                //    posts.forEach(post=>{
                //        delete post.__v;
                //        delete post._id;
                //    });
                   return posts;
               })
               .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
