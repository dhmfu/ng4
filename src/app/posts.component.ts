import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Post } from './post';
import { PostService } from './post.service';

@Component({
  selector: 'all-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  providers: [PostService]
})
export class PostsComponent implements OnInit{
    constructor(private postService: PostService, private router: Router) { }

    posts: Post[];
    allPosts: Post[];
    loading = true;

    ngOnInit(): void {
        this.postService.getPosts().then(res => {
            this.loading = false;
            this.allPosts = res;
            this.posts = this.allPosts.slice(0,5);
            // console.log(this.posts);
        })
        .then(()=>this.posts.map((post)=>{
            post.avatarUrl = post.avatarUrl || '../assets/sample-avatar.png';
            return post;
        }))
        .catch(err=>{
            // this.loading = false;
            //TODO: display error message
            console.log(err);
        });
    }

    delete(post: Post): void {
        this.postService.deletePost(post._id).then(res => {
            window.location.reload();
        })
        .catch(err=>{
            // this.loading = false;
            //TODO: display error message
            console.log(err);
        });
    }

    edit(): void {
        this.postService.editPost({description: 'blabla', _id: '59954e2400c16f453c4351af'}).then(res => {
            console.log(res);
        })
        .catch(err=>{
            // this.loading = false;
            //TODO: display error message
            console.log(err);
        });
    }
}
