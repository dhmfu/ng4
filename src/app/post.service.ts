import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { HttpRequest, HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { Post } from './post';
@Injectable()
export class PostService {
    constructor(private http: Http, private httpClient: HttpClient) { }

    private headers = new Headers({'Content-Type': 'text/plain', 'x-access-token': localStorage.getItem('token')});

    getPosts(): Promise<Post[]> {
        let options = new RequestOptions({ headers: this.headers});

        return this.http.get('http://localhost:3000/api/posts')
               .toPromise()
               .then(response => {
                   let posts: Array<any> = response.json();
                   posts.map(this.preparePost);
                   return posts as Post[];
               })
               .catch(this.handleError);
    }

    preparePost(post): Post {
        delete post.__v;
        post.avatarUrl = post.avatarUrl || '../assets/sample-avatar.png';
        return post as Post;
    }

    sendPost(postText: string, postTitle: string, file: File, callback: Function): Promise<Post> {
        let xhr = new XMLHttpRequest();
        let formData = new FormData();
        formData.append('file', file);
        formData.append('description', postText.trim().replace(/\n/g, '<br/>'));
        formData.append('title', postTitle.trim());
        return new Promise((resolve,reject)=>{
            xhr.onload = xhr.onerror = () => {
              if (xhr.status == 200) {
                resolve(this.preparePost(JSON.parse(xhr.response)) as Post);
              } else {
                reject("error " + xhr.status);
              }
            };

            xhr.upload.onprogress = function(event) {
                callback(Math.round((event.loaded/event.total)*100));
            }

            xhr.open("POST", "http://localhost:3000/api/posts/new", true);
            xhr.setRequestHeader('x-access-token', localStorage.getItem('token'));
            xhr.send(formData);
        });
    }

    sendFile(file, callback): Promise<any> {
        return new Promise((resolve, reject)=>{
            let xhr = new XMLHttpRequest();
            let formData = new FormData();
            formData.append('file', file);

            xhr.onload = xhr.onerror = () => {
              if (xhr.status == 200) {
                resolve("success");
              } else {
                reject("error " + xhr.status);
              }
            };

            xhr.upload.onprogress = function(event) {
                callback(Math.round((event.loaded/event.total)*100));
            }

            xhr.open("POST", "http://localhost:3000/api/posts/test", true);
            xhr.send(formData);
        });
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
