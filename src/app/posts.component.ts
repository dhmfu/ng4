import { Component, OnInit } from '@angular/core';

import { Post } from './post';
import { PostService } from './post.service';

@Component({
  selector: 'all-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  providers: [PostService]
})
export class PostsComponent implements OnInit{
    constructor(private postService: PostService) { }

    posts: Post[];
    loading = true;

    ngOnInit(): void {
        this.postService.getPosts().then(res => {
            this.loading = false;
            this.posts = res.slice(0,5);
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
}
