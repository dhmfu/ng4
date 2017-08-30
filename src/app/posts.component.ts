import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {MdDialog, MdDialogRef,MD_DIALOG_DATA} from '@angular/material';

import { Post } from './post';
import { PostService } from './post.service';

@Component({
  selector: 'all-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  providers: [PostService]
})
export class PostsComponent implements OnInit{
    constructor(private postService: PostService, private router: Router, public dialog: MdDialog) { }

    posts: Post[];
    allPosts: Post[];
    loading = true;
    user = JSON.parse(localStorage.getItem('user')) || {username: 'Guest'};

    ngOnInit(): void {
        this.postService.getPosts().then(res => {
            this.loading = false;
            this.allPosts = res;
            this.posts = this.allPosts.slice(0,5);
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
        if(confirm('Sure?'))
            this.postService.deletePost(post._id, this.user).then(res => {
                window.location.reload();
            })
            .catch(err=>{
                // this.loading = false;
                //TODO: display error message
                console.log(err);
            });
    }

    edit(post: Post) {
        let dialogRef = this.dialog.open(PostEditDialog, {
            data: post,
            height: '80%',
            width: '60%'
        });

        dialogRef.afterClosed().subscribe((data:any)=>{
            if(data) {
                let postToFind: Post = data.post, newText: string = data.text;
                this.loading = true;
                this.postService.editPost({description: newText, _id: postToFind._id}).then((res)=>{
                    this.posts.find((currentPost: Post)=>{
                        return currentPost == postToFind;
                    }).description = newText;
                    this.loading = false;
                }).catch((err)=>{
                    this.loading = false;
                    console.log(err);
                });
            }
        });
    }

    hasRights(post): boolean {
        return post.creatorId == this.user.id || this.user.superAdmin;
    }
}

@Component({
  selector: 'post-edit-dialog',
  templateUrl: 'post-edit-dialog.html',
  styleUrls: ['post-edit-dialog.css']
})
export class PostEditDialog implements OnInit{
  constructor(public dialogRef: MdDialogRef<PostEditDialog>,
      @Inject(MD_DIALOG_DATA) public data: Post) {
          this.post = Object.assign({}, this.data);
          this.post.description = this.post.description.replace(/<br[/]>/g, '\n');
  }

  post: Post;

  ngOnInit(): void {
      let textarea = document.getElementById('postText');
      textarea.addEventListener('focus', (event: Event) => {
          textarea.style.height = textarea.scrollHeight + 'px';
      });
  }

  resizeInput(element): void {
      element.style.height = element.scrollHeight + 'px';
  }

  onNoClick(): void {
      this.dialogRef.close();
  }

  onYesClick(): void {
      this.post.description = this.post.description.trim().replace(/\n/g, '<br/>');
      this.dialogRef.close({post: this.data, text: this.post.description});
  }
}
