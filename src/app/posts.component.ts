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
            console.log(this.posts);
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

    openDialog(post: Post) {
        let dialogRef = this.dialog.open(PostEditDialog, {
            data: post,
            height: '400px',
            width: '600px'
        });

        dialogRef.afterClosed().subscribe((data:any)=>{
            if(data) {
                let postToFind: Post = data.post, newText: string = data.text;
                this.posts.find((currentPost: Post)=>{
                    return currentPost == postToFind;
                }).description = newText;
            }
        });
    }

    edit(post: Post, event): void {
        // let text = event.target.closest('.mat-card-actions').previousElementSibling.childNodes[1];
        // text.setAttribute('contenteditable','true');
        // text.focus();
        //
        // let customSelection = () =>{
        //     let selection = window.getSelection(); //all this
        //     let range = document.createRange();    //for focusing
        //     range.setStart(text,0);                //editable
        //     range.setEnd(text,1);                  //paragraph
        //     selection.addRange(range);             //on it's
        //     return selection;                      //end
        // };
        //
        // let selection = customSelection();
        // selection.collapseToEnd();
        //
        // let blurEditFunc = (event: Event) => {
        //     let selection = customSelection();
        //     let newText = selection.toString().trim();
        //     console.log(newText); //SEND POST TO SERVER
        //     selection.collapseToEnd();
        //     text.removeEventListener('blur', blurEditFunc);
        //     text.setAttribute('contenteditable','false');
        // };
        //
        // let keysEditFunc = (event: KeyboardEvent) => {
        //     if(event.keyCode == 13 && !event.shiftKey){
        //         event.preventDefault();
        //         text.removeEventListener('keydown', keysEditFunc);
        //         blurEditFunc(event);
        //     }
        // };
        // text.addEventListener('blur', blurEditFunc);
        // text.addEventListener('keydown', keysEditFunc);
        // this.postService.editPost({description: 'blabla', _id: '59954e2400c16f453c4351af'}).then(res => {
        //     console.log(res);
        // })
        // .catch(err=>{
        //     // this.loading = false;
        //     //TODO: display error message
        //     console.log(err);
        // });
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
  }

  post: Post;

  ngOnInit(): void {

          this.post = Object.assign({}, this.data);
          this.post.description = this.post.description.replace(/<br[/]>/g, '\n');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
      this.post.description = this.post.description.replace(/\n/g, '<br/>');
      console.log(this.post);
      this.dialogRef.close({post: this.data, text: this.post.description});
  }
}
