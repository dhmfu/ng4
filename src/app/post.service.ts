import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Post } from './post';
@Injectable()
export class PostService {
    constructor(private http: Http) { }

    private headers = new Headers({'Content-Type': 'text/plain', 'x-access-token': localStorage.getItem('token')});

    getPosts(): Promise<Post[]> {
        return this.http.get('http://localhost:3000/api/posts')
               .toPromise()
               .then(response => {
                   let posts = response.json();
                //    posts.forEach(post=>{
                //        delete post.__v;
                //        delete post._id;
                //    });
                   return posts as Post[];
               })
               .catch(this.handleError);
    }

    sendPost(postText: string): Promise<any> {
        let body = JSON.stringify({description:postText.trim().replace(/\n/g, '<br/>')});
        let options = new RequestOptions({ headers: this.headers});

        return this.http.post('http://localhost:3000/api/posts/new', body, options)
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
    }

    deletePost(postId, user): Promise<any> {
        this.headers.append('x-user-username', user.username);
        let options = new RequestOptions({ headers: this.headers});

        return this.http.delete('http://localhost:3000/api/posts/'+postId, options)
               .toPromise()
               .then(response => response)
               .catch(this.handleError);
    }

    editPost(post): Promise<any> {
        let body = JSON.stringify({description:post.description.trim(), creator: post.creator});
        let options = new RequestOptions({ headers: this.headers});

        return this.http.patch('http://localhost:3000/api/posts/'+post._id, body, options)
               .toPromise()
               .then(response => response)
               .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
