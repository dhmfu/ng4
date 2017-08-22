import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Post } from './post';
@Injectable()
export class PostService {
    constructor(private http: Http) { }

    private headers = new Headers({'Content-Type': 'text/plain'});

    getPosts(): Promise<Post[]> {
        return this.http.get('http://localhost:3000/api/posts')
               .toPromise()
               .then(response => response.json() as Post[])
               .catch(this.handleError);
    }

    sendPost(post): Promise<any> {
        let body = JSON.stringify({post:post});
        console.log(body);
        let options       = new RequestOptions({ headers: this.headers}); // Create a request option


        return this.http.post('http://localhost:3000/api/posts/test', body, options)
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
