import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Post } from './post';

@Injectable()
export class PostService {
    constructor(private http: Http) { }

    getPosts(): Promise<Post[]> {
      return this.http.get('http://localhost:3000/api/posts')
               .toPromise()
               .then(response => {
                   console.log(response.json());
                   return response.json() as Post[];
               })
               .catch();
    }
}
