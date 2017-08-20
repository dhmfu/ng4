import { Component, OnInit } from '@angular/core';

import { Post } from './post';
import { PostService } from './post.service';

@Component({
  selector: 'new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
  providers: [PostService]
})
export class NewPostComponent implements OnInit{
    constructor(private postService: PostService) { }

    newPost: Post;
    // loading = true;

    ngOnInit(): void {
        // this.postService.getPosts().then(res => {
        //     this.loading = false;
        //     this.posts = res.slice(0,5);
        // })
        // .then(()=>this.posts.map((post)=>{
        //     post.avatarUrl = post.avatarUrl || '../assets/sample-avatar.png';
        //     return post;
        // }));
    }
}
