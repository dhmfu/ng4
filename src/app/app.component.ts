import { Component, OnInit } from '@angular/core';

import { Post } from './post';
import { PostService } from './post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PostService]
})
export class AppComponent {
    constructor(private postService: PostService) { }

    title = 'app';
    posts: Post[];

    ngOnInit(): void {
    this.postService.getPosts().then(res => this.posts = res);
    }
}
